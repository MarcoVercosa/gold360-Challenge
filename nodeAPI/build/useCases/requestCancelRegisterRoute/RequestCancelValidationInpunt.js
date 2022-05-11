"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestCancelValidationInpunt = void 0;
function RequestCancelValidationInpunt({ fullName, email }) {
    let fullNameValidation;
    let emailValidation;
    if (fullName.length > 50 || fullName.length < 4 || fullName == null || fullName == undefined) {
        return { sucess: false, result: "Full Name: Exceeded size limit/min or undefined" };
    }
    fullNameValidation = fullName;
    if (email.length > 50 || email.length < 4 || email == null || email == undefined) {
        return { sucess: false, result: "Email: Exceeded size limit/min or undefined" };
    }
    emailValidation = email;
    return {
        sucess: true,
        result: {
            fullNameValidate: fullNameValidation,
            emailValidate: emailValidation,
        }
    };
}
exports.RequestCancelValidationInpunt = RequestCancelValidationInpunt;
//# sourceMappingURL=RequestCancelValidationInpunt.js.map