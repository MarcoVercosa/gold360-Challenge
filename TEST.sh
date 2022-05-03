#!/bin/bash

x=1;

while [ $x -le 400 ];

do
echo $x
curl --request POST \
  --url http://localhost:3000/register \
  --header 'Content-Type: application/json' \
  --header 'origin: http://vidadafonte.com.br/android' \
  --header 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZnVsbE5hbWUiOiJNYXJjbyBBbnRvbmlvIFZlcsOnb3NhIGRhIFNpbHZhIiwiaWF0IjoxNjUxNTg3ODk4LCJleHAiOjE2NTE2NzQyOTh9.x5DD3QAgrmYSXQkviMmb546C4B_nmJJzABleQBG9E0c' \
  --data '
{
	"fullName": "Marta Marques de Souza Verçosaa",
	"email": "marta.souza@hotmail.com",
	"password": "M@rta@123456"
}
'
$(( x++ ))

done