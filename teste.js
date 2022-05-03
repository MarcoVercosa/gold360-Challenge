var axios = require("axios").default;

var options = {
  method: 'POST',
  url: 'http://localhost:3000/register',
  headers: {
    origin: 'http://vidadafonte.com.br/android',
    'Content-Type': 'application/json',
    'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZnVsbE5hbWUiOiJNYXJjbyBBbnRvbmlvIFZlcsOnb3NhIGRhIFNpbHZhIiwiaWF0IjoxNjUxNTg3ODk4LCJleHAiOjE2NTE2NzQyOTh9.x5DD3QAgrmYSXQkviMmb546C4B_nmJJzABleQBG9E0c'
  },
  data: {
    fullName: 'Marta Marques de Souza Verçosaa',
    email: 'marta.souza@hotmail.com',
    password: 'M@rta@123456'
  }
};

for(let i = 0; i < 25; i++){
    
    axios.request(options).then(function (response) {
    console.log(response.data);
    console.log(i)
    }).catch(function (error) {
    console.error(error);
    });
}