export interface IResult {
    sucess: boolean;
    token: string,
    result: number
}

export interface IRequestCreateUpdateRegisterController {
    Handle: (request: any, response: any) => Promise<{
        result: IResult | any;
        codeResult: number
    }>
}