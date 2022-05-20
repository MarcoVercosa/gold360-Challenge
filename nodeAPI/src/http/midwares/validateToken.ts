import jwt from 'jsonwebtoken';
import { ConnectionsName } from "../../services/connections"
import { config } from "dotenv"

function ValidadeToken(token: string) {
    let connections = ConnectionsName()
    config()
    let result = jwt.verify(token, connections.secretJSONWebToken as string, (err, decode: any) => {
        if (err) {
            return { auth: false, result: "Error token" }
        }
        return { auth: true, result: decode }
    })
    return result
}

export { ValidadeToken }