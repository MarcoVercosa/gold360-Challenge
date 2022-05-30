import { jest, expect, describe, it } from "@jest/globals"
import request from "supertest"
import { StartServer } from "../../http/index"


////////////////////////////////////////////////////////////////////////////////////
//                                L O G I N -- R O U T E 
////////////////////////////////////////////////////////////////////////////////////

let tokenGlobal: string = ""
let server: any

// async function BeforeAll(): Promise<void> {
//     server = await StartServer()
// }
// async function AfterAll() {
//     server.close()
// }

describe(" >>>>>> API END-TO-END LOGIN ROUTE", () => {
    //    let server: any
    //   beforeAll(async () => {
    //        server = await StartServer()
    //    })
    //    afterAll(async () => {
    //        server.close()
    //    })

    //BeforeAll()

    it("EMAIL AND PASSWORD CORRECTS => should return STATUS 200, SUCESS:TRUE and TOKEN WITH STRING", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/login")
            .send({
                email: "register@gmail.com",
                password: "Register@123456"
            })
        tokenGlobal = response.body?.token
        const token = response.body?.token.length > 0 ? "received token" : "not received token"
        expect(response.status).toBe(200);
        expect(response.body?.sucess).toBe(true)
        expect(token).toBe("received token")
    })
    it("EMAIL AND PASSWORD INCORRETS => should return STATUS 401, SUCESS:FALSE and TOKEN WITHOUT CONTENT", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/login")
            .send({
                email: "wrongemail@gmail.com",
                password: "wrongpass@123456"
            })
        const token: string = response.body?.token.length > 0 ? "received token" : "not received token"
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(token).toBe("not received token")
        expect(response.body?.result).toBe("User or password is incorrect")

    })
    it("EMAIL DO NOT SENT => should return STATUS 401, SUCESS:FALSE and TOKEN WITHOUT CONTENT", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/login")
            .send({
                //email: "wrongemail@gmail.com",
                password: "Register@123456"
            })
        const token: string = response.body?.token.length > 0 ? "received token" : "not received token"
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(token).toBe("not received token")
        expect(response.body?.result).toBe("User or password is incorrect")
    })
    it("PASSWORD DO NOT SENT => should return STATUS 401, SUCESS:FALSE and TOKEN WITHOUT CONTENT", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/login")
            .send({
                email: "register@gmail.com",
                //password: "wrongpass@123456"
            })
        const token: string = response.body?.token.length > 0 ? "received token" : "not received token"
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(token).toBe("not received token")
        expect(response.body?.result).toBe("User or password is incorrect")
    })
})
////////////////////////////////////////////////////////////////////////////////////
//              C R E A T E / U P D A T E / R E G I S T E R -- R O U T E 
////////////////////////////////////////////////////////////////////////////////////


describe(">>>>>> API END-TO-END CREATE / UPDATE REGISTER ROUTE", () => {
    //    let server: any
    //   beforeAll(async () => {
    //        server = await StartServer()
    //    })
    //    afterAll(async () => {
    //        server.close()
    //    })

    it("CREATE REGISTER WITH SUCESS => should return STATUS 200, SUCESS:TRUE and TOKEN WITH STRING", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/register")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Register Test da Silva",
                email: "registercreateRegister@gmail.com",
                password: "654321@Register"
            })
        const token: string = response.body?.token.length > 0 ? "received token" : "not received token"
        expect(response.status).toBe(200);
        expect(response.body?.sucess).toBe(true)
        expect(token).toBe("received token")
    })
    it("INVALIDATE TOKEN=> should return STATUS 401, SUCESS:FALSE and RESULT: Token invalid", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/register")
            .set({ 'x-access-token': `${tokenGlobal} + invalidateToken` })
            .send({
                fullName: "Register Test da Silva",
                email: "registercreateRegister@gmail.com",
                password: "654321@Register"
            })
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(response.body?.result).toBe("Token invalid")
    })
    it("REGISTER ALREADY EXISTS AND ALL FIELDS IS EQUAL TO REQUEST => should return STATUS 200, SUCESS:TRUE and RESULT: The Register is NOT MODIFIELD", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/register")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Register Test da Silva",
                email: "registercreateRegister@gmail.com",
                password: "654321@Register"
            })
        expect(response.status).toBe(200);
        expect(response.body?.sucess).toBe(true)
        expect(response.body?.result.message).toBe("The Register is NOT MODIFIELD")
    })
    it("Full Name: Exceeded size > 50 => should return STATUS 401, SUCESS:false and RESULT: Full Name: Exceeded size limit/min or undefined", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/register")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Register Test da Silvaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                email: "registercreateRegister@gmail.com",
                password: "654321@Register"
            })
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(response.body?.result).toBe("Full Name: Exceeded size limit/min or undefined")
    })
    it("FULL NAME: MIN 4 => should return STATUS 401, SUCESS:false and RESULT: Full Name: Exceeded size limit/min or undefined", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/register")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Reg",
                email: "registercreateRegister@gmail.com",
                password: "654321@Register"
            })
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(response.body?.result).toBe("Full Name: Exceeded size limit/min or undefined")
    })
    it("FULL NAME: IS NOT COMPLETE => should return STATUS 401, SUCESS:false and RESULT: Full Name: Your name must be full name", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/register")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Register",
                email: "registercreateRegister@gmail.com",
                password: "654321@Register"
            })
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(response.body?.result).toBe("Full Name: Your name must be full name")
    })
    it("FULL NAME IS NULL OR NOT SEND => should return STATUS 401, SUCESS:false and RESULT: Full Name: Exceeded size limit/min or undefined", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/register")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                //fullName:"Register Test da Silva",
                email: "registercreateRegister@gmail.com",
                password: "654321@Register"
            })
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(response.body?.result).toBe("Full Name: Exceeded size limit/min or undefined")
    })
    it("EMAIL NOT CONTAIN @ => should return STATUS 401, SUCESS:false and RESULT: Email: It doesn't appear to be a correct email.", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/register")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Register Test da Silva",
                email: "registercreateRegistergmail.com",
                password: "654321@Register"
            })
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(response.body?.result).toBe("Email: It doesn't appear to be a correct email.")
    })
    it("EMAIL CONTAIN ' => should return STATUS 401, SUCESS:false and RESULT: Email: It doesn't appear to be a correct email.", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/register")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Register Test da Silva",
                email: "regi'stercreate@Registergmail.com",
                password: "654321@Register"
            })
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(response.body?.result).toBe("Email: It doesn't appear to be a correct email.")
    })
    it("EMAIL CONTAIN # => should return STATUS 401, SUCESS:false and RESULT: Email: It doesn't appear to be a correct email.", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/register")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Register Test da Silva",
                email: "regi#stercreate@Registergmail.com",
                password: "654321@Register"
            })
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(response.body?.result).toBe("Email: It doesn't appear to be a correct email.")
    })
    it("EMAIL CONTAIN $ => should return STATUS 401, SUCESS:false and RESULT: Email: It doesn't appear to be a correct email.", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/register")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Register Test da Silva",
                email: "regi#stercreate@Registergmail.com",
                password: "654321@Register"
            })
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(response.body?.result).toBe("Email: It doesn't appear to be a correct email.")
    })
    it("EMAIL CONTAIN NUMBER AFTER '.' => should return STATUS 401, SUCESS:false and RESULT: Email: It doesn't appear to be a correct email.", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/register")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Register Test da Silva",
                email: "registercreate@Registergmail.com2",
                password: "654321@Register"
            })

        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(response.body?.result).toBe("Email: It doesn't appear to be a correct email.")
    })
    it("EMAIL IS NULL OR NOT SEND=> should return STATUS 401, SUCESS:false and RESULT: Email: It doesn't appear to be a correct email.", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/register")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Register Test da Silva",
                //email: "registercreateRegistergmail.com",
                password: "654321@Register"
            })
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(response.body?.result).toBe("Email: It doesn't appear to be a correct email.")
    })
    it("PASSWORD NOT CONTAIN SPECIAL CHARACTERS. => should return STATUS 401, SUCESS:false and RESULT: Password: At least one special character is required (@!#$%^&*). Uppercase, lowercase and numbers; Min : 8 character - Max: 35 character.", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/register")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Register Test da Silva",
                email: "registercreate@Registergmail.com",
                password: "654321Register"
            })
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(response.body?.result).toBe("Password: At least one special character is required (@!#$%^&*). Uppercase, lowercase and numbers; Min : 8 character - Max: 35 character.")
    })
    it("PASSWORD < 8 character. => should return STATUS 401, SUCESS:false and RESULT: Password: Min - 8 character and Max - 35 character.", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/register")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Register Test da Silva",
                email: "registercreate@Registergmail.com",
                password: "tess@Re"
            })
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(response.body?.result).toBe("Password: Min - 8 character and Max - 35 character.")
    })
    it("PASSWORD > 35 character. => should return STATUS 401, SUCESS:false and RESULT: Password: Min - 8 character and Max - 35 character.", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/register")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Register Test da Silva",
                email: "registercreate@Registergmail.com",
                password: "654321@RegisterRegisterRegisterRegister"
            })
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(response.body?.result).toBe("Password: Min - 8 character and Max - 35 character.")
    })
    it("PASSWORD IS NULL OR NOT SEND. => should return STATUS 401, SUCESS:false and RESULT: Password: Min - 8 character and Max - 35 character.", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/register")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Register Test da Silva",
                email: "registercreate@Registergmail.com",
                //password: "654321@RegisterRegisterRegisterRegister"
            })
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(response.body?.result).toBe("Password: Min - 8 character and Max - 35 character.")
    })
})


////////////////////////////////////////////////////////////////////////////////////
//              C A N C E L  R E G I S T E R -- R O U T E 
////////////////////////////////////////////////////////////////////////////////////


describe(" >>>>>> API END-TO-END CANCEL REGISTER", () => {
    //    let server: any
    //   beforeAll(async () => {
    //        server = await StartServer()
    //    })
    //    afterAll(async () => {
    //        server.close()
    //    })

    it("CANCEL REGISTER WITH SUCESS => should return STATUS 200, SUCESS:TRUE, TOKEN WITH STRING and RESULT: Register changed to Disabled", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/cancel")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Register Test da Silva",
                email: "registercreateRegister@gmail.com",
            })
        const token: string = response.body?.token.length > 0 ? "received token" : "not received token"
        expect(response.status).toBe(200);
        expect(response.body?.result.sucess).toBe(true)
        expect(response.body?.result.message).toBe("Register changed to Disabled")
        expect(token).toBe("received token")
    })
    it("CANCEL REGISTER THAT IS ALREADY CANCELED => should return STATUS 200, SUCESS:TRUE, TOKEN WITH STRING and RESULT: Register is already disabled. THERE WAS NO CHANGE IN DATABASE. Sent to Queue Dead", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/cancel")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Register Test da Silva",
                email: "registercreateRegister@gmail.com",
            })
        const token: string = response.body?.token.length > 0 ? "received token" : "not received token"
        expect(response.status).toBe(200);
        expect(response.body?.result.sucess).toBe(false)
        expect(response.body?.result.message).toBe("Register is already disabled. There was no change in DataBase. Sent to Queue Dead")
        expect(token).toBe("received token")
    })

    it("CANCEL REGISTER USER OR PASSWORD NOT FOUND => should return STATUS 200, SUCESS:FALSE, TOKEN WITH STRING and RESULT: FullName or/and email not found", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/cancel")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Register Test da Silvassss",
                email: "registercreateRegister@gmail.com",
            })
        const token: string = response.body?.token.length > 0 ? "received token" : "not received token"
        expect(response.status).toBe(200);
        expect(response.body?.result.sucess).toBe(false)
        expect(response.body?.result.message).toBe("FullName or/and email not found")
        expect(token).toBe("received token")
    })
    it("CANCEL REGISTER INVALIDATE TOKEN=> should return STATUS 401, SUCESS:FALSE and RESULT: Token invalid", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/cancel")
            .set({ 'x-access-token': `${tokenGlobal} + invalidateToken` })
            .send({
                fullName: "Register Test da Silva",
                email: "registercreateRegister@gmail.com",
            })
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(response.body?.result).toBe("Token invalid")
    })

    it("CANCEL REGISTER FULL NAME < 4 => should return STATUS 401, SUCESS:FALSE and RESULT: Full Name: Exceeded size max(50)/min(4),  undefined or invalid", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/cancel")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Reg",
                email: "registercreateRegister@gmail.com",
            })
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(response.body?.result).toBe("Full Name: Exceeded size max(50)/min(4),  undefined or invalid")
    })
    it("CANCEL REGISTER FULL NAME > 50 => should return STATUS 401, SUCESS:FALSE and RESULT: Full Name: Exceeded size max(50)/min(4),  undefined or invalid", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/cancel")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Register Test da Silva Register Test da Silva Register Test da Silva",
                email: "registercreateRegister@gmail.com",
            })
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(response.body?.result).toBe("Full Name: Exceeded size max(50)/min(4),  undefined or invalid")
    })
    it("CANCEL REGISTER FULL NAME NOT SEND => should return STATUS 401, SUCESS:FALSE and RESULT: Full Name: Exceeded size max(50)/min(4),  undefined or invalid", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/cancel")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                //fullName: "Register Test da Silva ",
                email: "registercreateRegister@gmail.com",
            })
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(response.body?.result).toBe("Full Name: Exceeded size max(50)/min(4),  undefined or invalid")
    })


    it("CANCEL REGISTER EMAIL < 7 => should return STATUS 401, SUCESS:FALSE and RESULT: Email: Exceeded size max(50)/min(7), undefined or invalid", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/cancel")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Register Test da Silv",
                email: "r@.com",
            })
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(response.body?.result).toBe("Email: Exceeded size max(50)/min(7), undefined or invalid")
    })
    it("CANCEL REGISTER EMAIL > 50 => should return STATUS 401, SUCESS:FALSE and RESULT: Email: Exceeded size max(50)/min(7), undefined or invalid", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/cancel")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Register Test da Silva",
                email: "registercreateRegisteegistercreateRegister@gmail.com",
            })
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(response.body?.result).toBe("Email: Exceeded size max(50)/min(7), undefined or invalid")
    })
    it("CANCEL REGISTER EMAIL NOT SEND => should return STATUS 401, SUCESS:FALSE and RESULT: Email: Exceeded size max(50)/min(7), undefined or invalid", async () => {
        // jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/cancel")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Register Test da Silva ",
                //email: "registercreateRegister@gmail.com",
            })
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(response.body?.result).toBe("Email: Exceeded size max(50)/min(7), undefined or invalid")
    })

    //  AfterAll()
})