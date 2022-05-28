import express from "express"
import swaggerUi from "swagger-ui-express"
import SwaggerDocs from "./swagger.json"
const expressServer = express()


function StartDocumentation() {
    if (process.env.NODE_ENV != "production"
        && process.env.NODE_ENV != "test"
    ) {
        expressServer.use("/documentation", swaggerUi.serve, swaggerUi.setup(SwaggerDocs))
        expressServer.listen(3030, () => {
            console.log("Swagger executing on port 3030")
        })
    }
}

export { StartDocumentation }

