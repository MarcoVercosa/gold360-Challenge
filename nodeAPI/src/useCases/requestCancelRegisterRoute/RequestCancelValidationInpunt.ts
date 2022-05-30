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



function RequestCancelValidationInpunt({ fullName = "", email = "" }: IParams): IReturn {
    let fullNameValidation: string
    let emailValidation: string

    if (fullName.length > 50 || fullName.length < 4 || fullName == null || fullName == undefined) {
        return { sucess: false, result: "Full Name: Exceeded size max(50)/min(4),  undefined or invalid" }
    }
    fullNameValidation = fullName

    if (email.length > 50 || email.length < 7 || email == null || email == undefined) {
        return { sucess: false, result: "Email: Exceeded size max(50)/min(7), undefined or invalid" }
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