#!/bin/bash

x=1;

while [ $x -le 300 ];

do
echo $x
curl --request POST \
  --url http://localhost:3000/register \
  --header 'Content-Type: application/json' \
  --header 'origin: http://vidadafonte.com.br/android' \
  --header 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZnVsbE5hbWUiOiJNYXJjbyBBbnRvbmlvIFZlcsOnb3NhIGRhIFNpbHZhIiwiaWF0IjoxNjUxNDI3MDA5LCJleHAiOjE2NTE1MTM0MDl9.-y11Jm1f1njiNfL3W4tyVMg2bSK6ot2qucDotld9t3Y' \
  --data '
{
	"fullName": "Marta Marques de Souza Verçosaa",
	"email": "marta.souza@hotmail.com",
	"password": "M@rta@123456"
}
'
$(( x++ ))

done