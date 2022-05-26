import { jest, expect, describe, test, it } from "@jest/globals"
import request from "supertest"
import { StartServer } from "../../http/index"


describe("API END-TO-END LOGIN ROUTE", () => {
    it("/POST => should return object", async () => {
        // jest.useFakeTimers();
        jest.setTimeout(30000);
        await StartServer()
        let response = await request("http://localhost:3000")
            .post("/login")
            .send({
                email: "register@gmail.com",
                password: "Register@123456"
            })
        expect(response.status).toBe(200);
        expect(response.body?.sucess).toBe(true)
    })
})


describe("API END-TO-END CREATE-UPDATE-REGISTER ROUTE", () => {
    test.todo("/POST => should return object")
})

describe("API END-TO-END CANCEL-REGISTER ROUTE", () => {
    test.todo("/POST => should return object")
})