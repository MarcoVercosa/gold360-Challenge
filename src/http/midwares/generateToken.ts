import jwt from "jsonwebtoken"
require('dotenv').config()

function GenerateToken(id: number, fullName: string) {
    const token = jwt.sign({ id, fullName }, process.env.SECRET as string, { expiresIn: 86400 }) //24hs
    return token
}

export { GenerateToken }