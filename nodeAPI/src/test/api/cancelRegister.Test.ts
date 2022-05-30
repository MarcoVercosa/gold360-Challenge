import { jest, expect, describe, it } from "@jest/globals"
import request from "supertest"
//import { StartServer } from "../../http/index"

////////////////////////////////////////////////////////////////////////////////////
//              C A N C E L  R E G I S T E R -- R O U T E 
////////////////////////////////////////////////////////////////////////////////////


async function CancelRegisterRouteTest() {
    describe(" >>>>>> API END-TO-END CANCEL REGISTER <<<<<<<", () => {
        let tokenGlobal: string = ""
        beforeAll(async () => {
            //server = await StartServer()
            let response = await request("http://localhost:3000")
                .post("/login")
                .send({
                    email: "register@gmail.com",
                    password: "Register@123456"
                })
            tokenGlobal = await response.body?.token
        })
        afterAll(async () => {
            //server.close()
        })
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
    })
}

export { CancelRegisterRouteTest }