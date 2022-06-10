import express from "express"
import swaggerUi from "swagger-ui-express"
import SwaggerDocs from "./swagger.json"
import { Logger } from '../services/createLogs/createLogs'
const expressServer = express()


function StartDocumentationSwagger() {
    if (process.env.NODE_ENV != "production"
        && process.env.NODE_ENV != "test"
    ) {
        try {
            expressServer.use("/documentation", swaggerUi.serve, swaggerUi.setup(SwaggerDocs))
            expressServer.listen(3030, () => {
                Logger.info(`HTTP DOCUMENTATION SWAGGER => started and listening on ${3030} o process ${process.pid}`)
            })
        } catch (error: any) {
            Logger.error(`HTTP DOCUMENTATION SWAGGER => ERROR: ${error}`)
        }
    }
}

export { StartDocumentationSwagger }

