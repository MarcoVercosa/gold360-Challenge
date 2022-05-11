"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidadeToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//require('dotenv').config()
const dotenv_1 = require("dotenv");
function ValidadeToken(token) {
    (0, dotenv_1.config)();
    let result = jsonwebtoken_1.default.verify(token, process.env.SECRET, (err, decode) => {
        if (err) {
            return { auth: false, result: "Error token" };
        }
        return { auth: true, result: decode };
    });
    return result;
}
exports.ValidadeToken = ValidadeToken;
//# sourceMappingURL=validateToken.js.map