#!/bin/bash

x=1;

while [ $x -le 600 ];

do
echo $x
curl --request POST \
  --url http://localhost:3000/register \
  --header 'Content-Type: application/json' \
  --header 'origin: http://vidadafonte.com.br/android' \
  --header 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZnVsbE5hbWUiOiJNYXJjbyBBbnRvbmlvIFZlcsOnb3NhIGRhIFNpbHZhIiwiaWF0IjoxNjUxMzI5MDM3LCJleHAiOjE2NTE0MTU0Mzd9.9FejbPtKCtL6CQAuWILAKRA5BgXubmNkKW6u_lPXfCE' \
  --data '
{
	"fullName": "Marta Marques de Souza Verçosaa",
	"email": "marta.souza@hotmail.com",
	"password": "M@rta@123456"
}
'
$(( x++ ))

done