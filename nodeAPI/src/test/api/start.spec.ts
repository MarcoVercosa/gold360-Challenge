import { jest, expect, describe, it } from "@jest/globals"
import request from "supertest"
import { StartServer } from "../../http/index"
import { LoginRouteTest } from "./loginRoute.Test"
import { CreatepdateRegisterRouteTest } from "./createUpdateRegisterRoute.Test"
import { CancelRegisterRouteTest } from "./cancelRegister.Test"

describe(" >>>>>> START TEST <<<<<<<", () => {

    let server: any
    beforeAll(async () => {
        server = await StartServer()
    })
    afterAll(async () => {
        server.close()
    })

    LoginRouteTest()
    CreatepdateRegisterRouteTest()
    CancelRegisterRouteTest()
})