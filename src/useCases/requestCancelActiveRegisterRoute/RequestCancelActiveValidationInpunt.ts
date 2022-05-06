interface IParams {
    fullName: string;
    email: string;
    active: boolean
}

interface IReturn {
    sucess: boolean;
    result: {
        fullNameValidate: string,
        emailValidate: string,
        activeValidate: boolean
    } | string;
}



function RequestCancelActiveValidationInpunt({ fullName, email, active }: IParams): IReturn {
    let fullNameValidation: string
    let emailValidation: string
    let activeValidation: boolean

    if (fullName.length > 50 || fullName.length < 4 || fullName == null || fullName == undefined) {
        return { sucess: false, result: "Full Name: Exceeded size limit/min or undefined" }
    }
    fullNameValidation = fullName
    if (email.length > 50 || email.length < 4 || email == null || email == undefined) {
        return { sucess: false, result: "Email: Exceeded size limit/min or undefined" }
    }
    emailValidation = email

    console.log(typeof (active))
    if (typeof (active) != "boolean") {
        return { sucess: false, result: "Active: Boolean type not identified" }
    }
    activeValidation = active

    return {
        sucess: true,
        result: {
            fullNameValidate: fullNameValidation,
            emailValidate: emailValidation,
            activeValidate: activeValidation
        }
    }
}

export { RequestCancelActiveValidationInpunt }