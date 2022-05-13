import { exec } from "child_process"

function CreateUsersRabbitMQ() {
    return new Promise((resolve, reject) => {

        exec('sh ./src/utils/createUsersRabbitMQ/scriptUserRabbitMQ.sh',
            (error, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                    setTimeout(() => {
                        console.log("we try create users again in 5 secs ")
                        CreateUsersRabbitMQ()
                    }, 5000)
                }
                console.log("Users created sucessufully")
                resolve(true)
            });
    })
}

export { CreateUsersRabbitMQ }