interface IParams {
    fullName: string;
    email: string;
}

interface IReturn {
    sucess: boolean;
    result: {
        fullNameValidate: string,
        emailValidate: string,
    } | string;
}



function RequestCancelValidationInpunt({ fullName, email }: IParams): IReturn {
    let fullNameValidation: string
    let emailValidation: string

    if (fullName.length > 50 || fullName.length < 4 || fullName == null || fullName == undefined) {
        return { sucess: false, result: "Full Name: Exceeded size limit/min or undefined" }
    }
    fullNameValidation = fullName
    if (email.length > 50 || email.length < 4 || email == null || email == undefined) {
        return { sucess: false, result: "Email: Exceeded size limit/min or undefined" }
    }
    emailValidation = email


    return {
        sucess: true,
        result: {
            fullNameValidate: fullNameValidation,
            emailValidate: emailValidation,
        }
    }
}

export { RequestCancelValidationInpunt }