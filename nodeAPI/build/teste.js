"use strict";
var axios = require("axios").default;
var teste = require('uuid');
teste.v4;
async function Performance() {
    let data = [];
    for (let i = 0; i < 1500; i++) {
        let email = teste.v4();
        var options = {
            method: 'POST',
            url: 'http://localhost:3000/register',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZnVsbE5hbWUiOiJNYXJjbyBBbnRvbmlvIFZlcsOnb3NhIGRhIFNpbHZhIiwiaWF0IjoxNjUxNjc2MDgwLCJleHAiOjE2NTE3NjI0ODB9.0MyNrRr3Mj0CfbYPMopJetqNi93GSIsEYRLtmMIhAMA'
            },
            data: {
                fullName: 'Marta Marques de Souza Verçosaa',
                email: email + "@hotmail.com",
                password: 'M@rta@123456'
            }
        };
        await axios.request(options).then(function (response) {
            //console.log(response.data);
            data.push(response.data);
            console.log(i);
        }).catch(function (error) {
            console.error(error.response.data);
        });
    }
    return data;
}
var timetaken = "Time taken by addCount function";
console.time(timetaken);
Performance().then(data => console.timeEnd(timetaken));
//# sourceMappingURL=teste.js.map