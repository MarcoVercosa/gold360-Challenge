import { IRequestCancelRegisterController } from "../../entities/requestCancelRoute/IRequestCancelRegisterController";
import { RequestCancelActiveRegisterUseCase } from "./requestCancelRegisterUseCase";

interface IParams {
    id: number;
    fullName: string
}

export class RequestCancelActiveRegisterController implements IRequestCancelRegisterController {
    constructor(
        private requestCancelActiveRegisterUseCase: RequestCancelActiveRegisterUseCase
    ) { }

    async Handle(request: any): Promise<{ result: number | string; codeResult: number }> {
        const token = request.headers['x-access-token'] as string;
        const { id, fullName }: IParams = request.body as any
        try {
            let result: any = await this.requestCancelActiveRegisterUseCase.Execute(token, id, fullName)
            if (result.sucess) {
                return { result, codeResult: 200 }
            }
            else {
                return { result, codeResult: 401 }
            }
        }
        catch (err: any) {
            return { result: err, codeResult: 500 }
        }
    }
}