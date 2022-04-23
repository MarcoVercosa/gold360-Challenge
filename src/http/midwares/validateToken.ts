import jwt from 'jsonwebtoken';
require('dotenv').config()

function ValidadeToken(token: string) {
    let result = jwt.verify(token, process.env.SECRET as string, (err, decode: any) => {
        if (err) {
            return { auth: false, result: "Error token" }
        }
        return { auth: true, result: decode }
    })
    return result
}

export { ValidadeToken }