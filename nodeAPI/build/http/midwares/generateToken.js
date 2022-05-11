"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//require('dotenv').config()
const dotenv_1 = require("dotenv");
function GenerateToken(id, fullName) {
    (0, dotenv_1.config)();
    const token = jsonwebtoken_1.default.sign({ id, fullName }, process.env.SECRET, { expiresIn: 86400 }); //24hs
    return token;
}
exports.GenerateToken = GenerateToken;
//# sourceMappingURL=generateToken.js.map