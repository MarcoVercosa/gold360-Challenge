import { exec } from "child_process"

function CreateUsersRabbitMQ() {
    return new Promise((resolve, reject) => {

        exec('sh scriptUserRabbitMQ.sh',
            (error, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                    setTimeout(() => {
                        console.log("we try create users again in 5 secs ")
                    }, 5000)
                    reject(false)
                }
                resolve(true)
            });
        console.log("Users created sucessufully")
    })
}

export { CreateUsersRabbitMQ }