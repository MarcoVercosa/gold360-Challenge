"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestCreateUpdateRegisterValidationInpunt = void 0;
function RequestCreateUpdateRegisterValidationInpunt({ fullName = "", email = "", password = "" }) {
    let firstNameValidation;
    let fullNameValidation;
    let emailValidation;
    let passwordValitation;
    //VALIDATE FULLNAME AND FILL IN THE FIRST NAME VARIABLE
    if (fullName.length > 50 || fullName.length < 4 || fullName == null || fullName == undefined) {
        return { sucess: false, result: "Full Name: Exceeded size limit/min or undefined" };
    }
    if (fullName.split(" ").length < 2) {
        return { sucess: false, result: "Full Name: Your name must be full name" };
    }
    firstNameValidation = fullName.split(" ")[0];
    fullNameValidation = fullName;
    //VALIDATE EMAIL
    let regEXPEmail = /^\w+([\.-]?\w+)*@\D+\.\D+$/gm;
    //before @ CAN contain only letters and or number, underscore and line. After @ cannot contain number and after . can't have number
    if (regEXPEmail.test(email) == false || email.length < 5 || email == null || email == undefined) {
        return { sucess: false, result: "Email: It doesn't appear to be a correct email." };
    }
    emailValidation = email;
    //VALIDATE PASSWORD
    if (password.length < 8 || password.length > 35) {
        return { sucess: false, result: "Password: Min - 8 character and Max - 35 character." };
    }
    let regEXPPassword = /(?=.*[@!#$%^&*()/\\])[@!#$%^&*()/\\a-zA-Z0-9]{8,35}$/;
    //allows special characters: @!#$%^&*() letters from a-z and a-z and numbers minMax: 8-35
    if (regEXPPassword.test(password) == false || password == null || password == undefined) {
        return { sucess: false, result: "Password: At least one special character is required (@!#$%^&*). Uppercase, lowercase and numbers; Min : 8 character - Max: 35 character." };
    }
    passwordValitation = password;
    return {
        sucess: true,
        result: {
            firstNameValidate: firstNameValidation,
            fullNameValidate: fullNameValidation,
            emailValidate: emailValidation,
            passwordValidate: passwordValitation
        }
    };
}
exports.RequestCreateUpdateRegisterValidationInpunt = RequestCreateUpdateRegisterValidationInpunt;
//# sourceMappingURL=requestCreateUpdateRegisterValidationInpunt.js.map