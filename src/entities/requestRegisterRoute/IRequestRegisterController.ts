export interface IResult {
    sucess: boolean;
    token: string,
    result: number
}

export interface IRequestRegisterController {
    Handle: (request: any, response: any) => Promise<{
        result: IResult | any;
        codeResult: number
    }>
}
