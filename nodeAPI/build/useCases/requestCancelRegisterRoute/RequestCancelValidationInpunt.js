"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestCancelValidationInpunt = void 0;
function RequestCancelValidationInpunt({ fullName = "", email = "" }) {
    let fullNameValidation;
    let emailValidation;
    if (fullName.length > 50 || fullName.length < 4 || fullName == null || fullName == undefined) {
        return { sucess: false, result: "Full Name: Exceeded size max(50)/min(4),  undefined or invalid" };
    }
    fullNameValidation = fullName;
    if (email.length > 50 || email.length < 7 || email == null || email == undefined) {
        return { sucess: false, result: "Email: Exceeded size max(50)/min(7), undefined or invalid" };
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