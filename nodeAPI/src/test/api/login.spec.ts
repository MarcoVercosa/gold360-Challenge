import { jest, expect, describe, it } from "@jest/globals"
import request from "supertest"
import { StartServer } from "../../http/index"


////////////////////////////////////////////////////////////////////////////////////
//                                L O G I N -- R O U T E 
////////////////////////////////////////////////////////////////////////////////////

let tokenGlobal: string = ""

describe("API END-TO-END LOGIN ROUTE", () => {
    let server: any
    beforeEach(async () => {
        server = await StartServer()
    })
    afterEach(async () => {
        server.close()
    })
    it("EMAIL AND PASSWORD CORRECTS => should return STATUS 200, SUCESS:TRUE and TOKEN WITH STRING", async () => {
        jest.setTimeout(30000);
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
})

describe("API END-TO-END LOGIN ROUTE", () => {
    let server: any
    beforeEach(async () => {
        server = await StartServer()
    })
    afterEach(async () => {
        server.close()
    })
    it("/POST => EMAIL AND PASSWORD INCORRETS => should return STATUS 401, SUCESS:FALSE and TOKEN WITH CONTENT", async () => {
        jest.setTimeout(30000);
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
})

describe("API END-TO-END LOGIN ROUTE", () => {
    let server: any
    beforeEach(async () => {
        server = await StartServer()
    })
    afterEach(async () => {
        server.close()
    })
    it("/POST => EMAIL DO NOT SENT => should return STATUS 401, SUCESS:FALSE and TOKEN WITHOUT CONTENT", async () => {
        jest.setTimeout(30000);
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
})

describe("API END-TO-END LOGIN ROUTE", () => {
    let server: any
    beforeEach(async () => {
        server = await StartServer()
    })
    afterEach(async () => {
        server.close()
    })
    it("/POST => PASSWORD DO NOT SENT => should return STATUS 401, SUCESS:FALSE and TOKEN WITHOUT CONTENT", async () => {
        jest.setTimeout(30000);
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


describe("API END-TO-END CREATE / UPDATE REGISTER ROUTE", () => {
    let server: any
    beforeEach(async () => {
        server = await StartServer()
    })
    afterEach(async () => {
        server.close()
    })
    it("CREATE REGISTER WITH SUCESS => should return STATUS 200, SUCESS:TRUE and TOKEN WITH STRING", async () => {
        jest.setTimeout(30000);
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
})

describe("API END-TO-END CREATE / UPDATE REGISTER ROUTE", () => {
    let server: any
    beforeEach(async () => {
        server = await StartServer()
    })
    afterEach(async () => {
        server.close()
    })
    it("INVALIDATE TOKEN=> should return STATUS 401, SUCESS:FALSE and RESULT: Token invalid", async () => {
        jest.setTimeout(30000);
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
})

describe("API END-TO-END CREATE / UPDATE REGISTER ROUTE", () => {
    let server: any
    beforeEach(async () => {
        server = await StartServer()
    })
    afterEach(async () => {
        server.close()
    })
    it("REGISTER ALREADY EXISTS AND ALL FIELDS IS EQUAL TO REQUEST => should return STATUS 200, SUCESS:TRUE and RESULT: The Register is NOT MODIFIELD", async () => {
        jest.setTimeout(30000);
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
})

describe("API END-TO-END CREATE / UPDATE REGISTER ROUTE", () => {
    let server: any
    beforeEach(async () => {
        server = await StartServer()
    })
    afterEach(async () => {
        server.close()
    })
    it("Full Name: Exceeded size > 50 => should return STATUS 401, SUCESS:false and RESULT: Full Name: Exceeded size limit/min or undefined", async () => {
        jest.setTimeout(30000);
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
})

describe("API END-TO-END CREATE / UPDATE REGISTER ROUTE", () => {
    let server: any
    beforeEach(async () => {
        server = await StartServer()
    })
    afterEach(async () => {
        server.close()
    })
    it("FULL NAME: MIN 4 => should return STATUS 401, SUCESS:false and RESULT: Full Name: Exceeded size limit/min or undefined", async () => {
        jest.setTimeout(30000);
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
})
describe("API END-TO-END CREATE / UPDATE REGISTER ROUTE", () => {
    let server: any
    beforeEach(async () => {
        server = await StartServer()
    })
    afterEach(async () => {
        server.close()
    })
    it("FULL NAME: IS NOT COMPLETE => should return STATUS 401, SUCESS:false and RESULT: Full Name: Your name must be full name", async () => {
        jest.setTimeout(30000);
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
})

describe("API END-TO-END CREATE / UPDATE REGISTER ROUTE", () => {
    let server: any
    beforeEach(async () => {
        server = await StartServer()
    })
    afterEach(async () => {
        server.close()
    })
    it("FULL NAME IS NULL OR NOT SEND => should return STATUS 401, SUCESS:false and RESULT: Full Name: Exceeded size limit/min or undefined", async () => {
        jest.setTimeout(30000);
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
})

describe("API END-TO-END CREATE / UPDATE REGISTER ROUTE", () => {
    let server: any
    beforeEach(async () => {
        server = await StartServer()
    })
    afterEach(async () => {
        server.close()
    })
    it("EMAIL NOT CONTAIN @ => should return STATUS 401, SUCESS:false and RESULT: Email: It doesn't appear to be a correct email.", async () => {
        jest.setTimeout(30000);
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
})

describe("API END-TO-END CREATE / UPDATE REGISTER ROUTE", () => {
    let server: any
    beforeEach(async () => {
        server = await StartServer()
    })
    afterEach(async () => {
        server.close()
    })
    it("EMAIL CONTAIN ' => should return STATUS 401, SUCESS:false and RESULT: Email: It doesn't appear to be a correct email.", async () => {
        jest.setTimeout(30000);
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
})

describe("API END-TO-END CREATE / UPDATE REGISTER ROUTE", () => {
    let server: any
    beforeEach(async () => {
        server = await StartServer()
    })
    afterEach(async () => {
        server.close()
    })
    it("EMAIL CONTAIN # => should return STATUS 401, SUCESS:false and RESULT: Email: It doesn't appear to be a correct email.", async () => {
        jest.setTimeout(30000);
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
})
describe("API END-TO-END CREATE / UPDATE REGISTER ROUTE", () => {
    let server: any
    beforeEach(async () => {
        server = await StartServer()
    })
    afterEach(async () => {
        server.close()
    })
    it("EMAIL CONTAIN $ => should return STATUS 401, SUCESS:false and RESULT: Email: It doesn't appear to be a correct email.", async () => {
        jest.setTimeout(30000);
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
})
describe("API END-TO-END CREATE / UPDATE REGISTER ROUTE", () => {
    let server: any
    beforeEach(async () => {
        server = await StartServer()
    })
    afterEach(async () => {
        server.close()
    })
    it("EMAIL CONTAIN ' => should return STATUS 401, SUCESS:false and RESULT: Email: It doesn't appear to be a correct email.", async () => {
        jest.setTimeout(30000);
        let response = await request("http://localhost:3000")
            .post("/register")
            .set({ 'x-access-token': `${tokenGlobal}` })
            .send({
                fullName: "Register Test da Silva",
                email: "registercreate@Regis2tergmail.com",
                password: "654321@Register"
            })
        expect(response.status).toBe(401);
        expect(response.body?.sucess).toBe(false)
        expect(response.body?.result).toBe("Email: It doesn't appear to be a correct email.")
    })
})
describe("API END-TO-END CREATE / UPDATE REGISTER ROUTE", () => {
    let server: any
    beforeEach(async () => {
        server = await StartServer()
    })
    afterEach(async () => {
        server.close()
    })
    it("EMAIL CONTAIN NUMBER AFTER . => should return STATUS 401, SUCESS:false and RESULT: Email: It doesn't appear to be a correct email.", async () => {
        jest.setTimeout(30000);
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
})

describe("API END-TO-END CREATE / UPDATE REGISTER ROUTE", () => {
    let server: any
    beforeEach(async () => {
        server = await StartServer()
    })
    afterEach(async () => {
        server.close()
    })
    it("EMAIL IS NULL OR NOT SEND=> should return STATUS 401, SUCESS:false and RESULT: Email: It doesn't appear to be a correct email.", async () => {
        jest.setTimeout(30000);
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
})


describe("API END-TO-END CREATE / UPDATE REGISTER ROUTE", () => {
    let server: any
    beforeEach(async () => {
        server = await StartServer()
    })
    afterEach(async () => {
        server.close()
    })
    it("PASSWORD NOT CONTAIN SPECIAL CHARACTERS. => should return STATUS 401, SUCESS:false and RESULT: Password: At least one special character is required (@!#$%^&*). Uppercase, lowercase and numbers; Min : 8 character - Max: 35 character.", async () => {
        jest.setTimeout(30000);
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
})

describe("API END-TO-END CREATE / UPDATE REGISTER ROUTE", () => {
    let server: any
    beforeEach(async () => {
        server = await StartServer()
    })
    afterEach(async () => {
        server.close()
    })
    it("PASSWORD < 8 character. => should return STATUS 401, SUCESS:false and RESULT: Password: Min - 8 character and Max - 35 character.", async () => {
        jest.setTimeout(30000);
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
})

describe("API END-TO-END CREATE / UPDATE REGISTER ROUTE", () => {
    let server: any
    beforeEach(async () => {
        server = await StartServer()
    })
    afterEach(async () => {
        server.close()
    })
    it("PASSWORD > 35 character. => should return STATUS 401, SUCESS:false and RESULT: Password: Min - 8 character and Max - 35 character.", async () => {
        jest.setTimeout(30000);
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
})

describe("API END-TO-END CREATE / UPDATE REGISTER ROUTE", () => {
    let server: any
    beforeEach(async () => {
        server = await StartServer()
    })
    afterEach(async () => {
        server.close()
    })
    it("PASSWORD IS NULL OR NOT SEND. => should return STATUS 401, SUCESS:false and RESULT: Password: Min - 8 character and Max - 35 character.", async () => {
        jest.setTimeout(30000);
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
