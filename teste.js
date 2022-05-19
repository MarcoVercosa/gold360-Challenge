var axios = require("axios").default;
var teste  = require('uuid')
teste.v4
async function Performance(){
    let data = []
    for(let i = 0; i < 4000; i++){
        let email  =  teste.v4()
        var options = {
        method: 'POST',
        url: 'http://localhost/register',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZnVsbE5hbWUiOiJSZWdpc3RlciBSZWdpc3RlciBSZWdpc3RlciIsImlhdCI6MTY1Mjc2NTA3OSwiZXhwIjoxNjUyODUxNDc5fQ.cLrH7xR2SEaZvM0Kh5pnDgPAzuMNumcZF_fvY5Bq-QY'
        },
        data: {
            "fullName": "Marta Marques de Souza Verçosa",
            "email": "marta.souza@hotmail.com",
            "password": "M@rta@123456"
        }
        };
    
        await axios.request(options).then(function (response) {
        data.push(response.data, i)
        console.log(i)
        }).catch(function (error) {
        console.error(error.response.data);
        });
    }
  return data
}
var timetaken = "Time taken by addCount function"
console.time(timetaken)
Performance().then(data => console.timeEnd(timetaken))