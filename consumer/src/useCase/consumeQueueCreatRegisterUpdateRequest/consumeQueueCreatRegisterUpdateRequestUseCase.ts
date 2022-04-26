
import { Channel, connect } from "amqplib"
import { ICreatRegisterUpdateRequestUseCase, IParams } from "../../entities/CreatRegisterUpdateRequest/ICreatRegisterUpdateRequestUseCase"
import { CreateRegisterUpdateRequestRepository } from "../../repository/CreatRegisterUpdateRequestRepository"



export class ConsumeQueueCreatRegisterUpdateRequestUseCase implements ICreatRegisterUpdateRequestUseCase {

    AMQPQueueServer: string
    nameQueue: string
    channel: Channel | null
    dataQueue: IParams

    constructor(
        AMQPQueueServer: string,
        NameQueue: string,
        private createRegisterUpdateRequestRepository: CreateRegisterUpdateRequestRepository,
    ) {
        this.AMQPQueueServer = AMQPQueueServer
        this.nameQueue = NameQueue
        this.channel = null
        this.dataQueue = this.ConsumeQueue() as any
        //call function than check connection with channel and store in object the data consumed 
    }

    //conect with habitmq and create the queue. If already create, do nothing.
    async ConnectAMQPQueueServer(): Promise<Channel | null> {

        try {
            const connection = await connect(this.AMQPQueueServer)
            const channelOpen = await connection.createChannel()
            console.log("Connected to habbitMQ.")
            this.channel = channelOpen
            return channelOpen
        } catch (err) {
            console.log("Erro to connect to RabbitMQ." + err)
            return null
        }
    }

    async ConsumeQueue(): Promise<IParams | null> {
        let OpenConectionQueue = await this.ConnectAMQPQueueServer()
        if (!OpenConectionQueue) {
            return null
        }

        console.log("Consumo solicitado")

        let result = await this.channel?.consume(this.nameQueue,
            async (data: any) => {
                let dataConsume: any = await JSON.parse(data.content.toString())//change de buffer to string and JSON.parse to object                
                console.log("Consumindo")
                console.log(dataConsume)
                //this.channel?.ack(data) //avisa ao habbitMQ que os dados foram recebidos e tratados e pode ser liberado do fila 
                return dataConsume

            }

        )

        return result as any
    }

    async Execute() {
        let isAdmin = await this.createRegisterUpdateRequestRepository.UserIsAdminConfirm({ idToken: this.dataQueue.idToken, fullNameToken: this.dataQueue.fullNameToken })
        if (!isAdmin) { return { sucess: true, result: "Permission denied" } }//cancel if is not admin
        //checka if register already exists
        let registerAlreadyExists: [] = await this.createRegisterUpdateRequestRepository.CheckIfRegisterAlreadyExists(this.dataQueue.email, this.dataQueue.fullName)
        //execute the create or update
        await this.createRegisterUpdateRequestRepository.RequestRegisterRepository({
            firstName: this.dataQueue.firstName,
            fullName: this.dataQueue.fullName,
            email: this.dataQueue.email,
            password: this.dataQueue.password,
            lastUpDateBy: this.dataQueue.fullName
        })
        if (registerAlreadyExists.length > 0) {
            return { sucess: true, result: "Register already exists. It's was updated successfully" }
        }
        return { sucess: true, result: "Register created successfully" }
    }

}