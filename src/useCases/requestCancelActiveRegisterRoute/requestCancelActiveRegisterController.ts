import { IRequestCancelRegisterController, IParams } from "../../entities/requestCancelActiveRoute/IRequestCancelRegisterController";
import { RequestCancelActiveRegisterUseCase } from "./requestCancelActiveRegisterUseCase";


export class RequestCancelActiveRegisterController implements IRequestCancelRegisterController {
    constructor(
        private requestCancelActiveRegisterUseCase: RequestCancelActiveRegisterUseCase
    ) { }

    async Handle(request: any): Promise<{ result: number | string; codeResult: number }> {
        const token = request.headers['x-access-token'] as string;
        const { fullName, email, active }: IParams = request.body as any
        try {
            let result: any = await this.requestCancelActiveRegisterUseCase.Execute({ token, fullName, email, active })
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