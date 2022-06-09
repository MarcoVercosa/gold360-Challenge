import { jest, expect, describe, it } from "@jest/globals"
import request from "supertest"
//import { StartServer } from "../../http/index"


////////////////////////////////////////////////////////////////////////////////////
//                                L O G I N -- R O U T E 
////////////////////////////////////////////////////////////////////////////////////


async function LoginRouteTest() {
    describe(" ##############  API END-TO-END LOGIN ROUTE ############## ", () => {

        it("EMAIL AND PASSWORD CORRECTS => should return STATUS 200, SUCESS:TRUE and TOKEN WITH STRING", async () => {
            // jest.setTimeout(30000);
            let response = await request("http://localhost:3000")
                .post("/login")
                .send({
                    email: "register@gmail.com",
                    password: "Register@123456"
                })
            const token = response.body?.token.length > 0 ? "received token" : "not received token"
            expect(response.status).toBe(200);
            expect(response.body?.sucess).toBe(true)
            expect(token).toBe("received token")
        })
        it("EMAIL AND/OR PASSWORD INCORRECTS => should return STATUS 401, SUCESS:FALSE and TOKEN WITHOUT CONTENT", async () => {
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
}
export { LoginRouteTest }


