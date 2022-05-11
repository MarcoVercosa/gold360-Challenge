import jwt from 'jsonwebtoken';
//require('dotenv').config()
import { config } from "dotenv"

function ValidadeToken(token: string) {
    config()
    let result = jwt.verify(token, process.env.SECRET as string, (err, decode: any) => {
        if (err) {
            return { auth: false, result: "Error token" }
        }
        return { auth: true, result: decode }
    })
    return result
}

export { ValidadeToken }