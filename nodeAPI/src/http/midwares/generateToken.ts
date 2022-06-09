import jwt from "jsonwebtoken"
import { ConnectionsName } from "../../services/connections"
import { config } from "dotenv"

function GenerateToken(id: number, fullName: string) {

    let connections = ConnectionsName()
    config()
    const token = jwt.sign({ id, fullName }, connections.secretJSONWebToken as string, { expiresIn: 86400 }) //24hs
    return token
}
export { GenerateToken }