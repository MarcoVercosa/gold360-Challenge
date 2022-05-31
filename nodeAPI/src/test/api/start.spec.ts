import { jest, expect, describe, it } from "@jest/globals"
import request from "supertest"
import { StartServerClass } from "../../http/index"
import { LoginRouteTest } from "./loginRoute.Test"
import { CreatepdateRegisterRouteTest } from "./createUpdateRegisterRoute.Test"
import { CancelRegisterRouteTest } from "./cancelRegister.Test"

describe(" ############## START TEST ############## ", () => {

    let classServer = new StartServerClass()
    let closeServer: any
    beforeAll(async () => {
        closeServer = await classServer.Execute()

    })
    afterAll(async () => {
        closeServer.close()
    })

    LoginRouteTest()
    CreatepdateRegisterRouteTest()
    CancelRegisterRouteTest()
})