#!/bin/bash
    printf '                                                          \U1F30D \U1F30D \U1F30D \U1F30D \U1F30D \n'
echo "FIND SERVER ENVIRONMENT"

if ping -c 1 -W 3 172.20.0.3; then
  clear
  printf '                                                                     \U1F9D0 \U1F9D0  \U1F9D0  \U1F9D0  \U1F9D0  \n'
  echo " "
  echo "                                            ###################################################################"
  echo "                                            #                     P R O D U C T I O N                         #"
  echo "                                            #                                                                 #"
  echo "                                            #  COMMANDS EXECUTE ON >>>>> RABBITMQ SERVER  <<<<<<<<<           #"
  echo "                                            #                                                                 #"
  echo "                                            #                                                                 #"
  echo "                                            ###################################################################"
  SERVER=rabbitmq    
elif ping -c 1 -W 3 172.21.0.3; then
  clear
  printf '                                                                     \U1F9D0 \U1F9D0  \U1F9D0  \U1F9D0  \U1F9D0  \n'
  echo " "
  echo "                                            ###################################################################"
  echo "                                            #                      D E V E L O P M E N T                      #"
  echo "                                            #                                                                 #"
  echo "                                            #  COMMANDS EXECUTE ON >>>>>>>>> DEV-RABBITMQ SERVER <<<<<<<<<<   #"
  echo "                                            #                                                                 #"
  echo "                                            #                                                                 #"
  echo "                                            ###################################################################"
  SERVER=dev-rabbitmq
elif ping -c 1 -W 3 172.22.0.3; then
  clear
  printf '                                                                     \U1F9D0 \U1F9D0  \U1F9D0  \U1F9D0  \U1F9D0  \n'
  echo " "
  echo "                                            ###################################################################"
  echo "                                            #                           T E S T                               #"
  echo "                                            #                                                                 #"
  echo "                                            #  COMMANDS EXECUTE ON >>>>>>>>> 'TEST' DEV-RABBITMQ SERVER <<<<< #"
  echo "                                            #                                                                 #"
  echo "                                            #                                                                 #"
  echo "                                            ###################################################################"
  SERVER=dev-rabbitmq 
else
  printf '                                                                     \U274C  \U274C  \U274C  \U274C  \U274C \n'
  echo " "
  echo "                                            ###################################################################"
  echo "                                            #         E R R O R         E R R O R       E R R O R             #"
  echo "                                            #                                                                 #"
  echo "                                            #  RABBITMQ PROD AND DEV >>>>>>>>> NOT ACESSIBLE <<<<<<<<<<<<     #"
  echo "                                            #                                                                 #"
  echo "                                            #                                                                 #"
  echo "                                            ###################################################################"

  echo "EXITING SCRIPT"
  exit
fi

sleep 5

for((i = 8; i >= 0; i--))
  do
    clear
    echo " "
    printf '                                                          \U231A  \U231A  \U231A  \U231A  \U231A \n'
    echo " "
    echo "CHANGING PERMISSIONS /var/lib/rabbitmq/.erlang.cookie ===>  $i ..."
    sleep 1
done

captureResultCHMOD=$(sudo docker container exec $SERVER chmod 600 /var/lib/rabbitmq/.erlang.cookie 2>&1 >/dev/null)
# the captureResultCHMOD var will store the message of command

# if error on chmod, the exit is not 0
if [ $? -ne 0 ]; then
  echo " "
  printf '                                                           \U274C  \U274C  \U274C  \U274C  \U274C \n '
  echo " "
  echo "ERROR ===> $captureResultCHMOD "
else
  printf '                                                           \U2705  \U2705  \U2705  \U2705  \U2705  \n '
  echo " "
  echo "PERMISSION ON /var/lib/rabbitmq/.erlang.cookie SUCCESSFULLY EXECUTED"
fi
sleep 5

  for((i = 10; i >= 0; i--))
    do
      clear
      echo " "
      printf '                                                        \U231A  \U231A  \U231A  \U231A  \U231A  \n '
      echo " "
      echo "WAITING FOR INITIALIZATION RABBITMQ SERVER ====>  $i ..."
      sleep 1
  done
  echo " "
  echo "CONFIGURING USERS, PASS AND QUEUES"
  sudo docker container exec $SERVER rabbitmqctl add_user cancel_register_bd cancel_register_bd
  sudo docker container exec $SERVER rabbitmqctl set_user_tags cancel_register_bd  administrator
  sudo docker container exec $SERVER rabbitmqctl set_permissions -p / cancel_register_bd ".*" ".*" ".*"
  sudo docker container exec $SERVER  rabbitmqctl add_user cancel_register_bd_consumer cancel_register_bd_consumer
  sudo docker container exec $SERVER  rabbitmqctl set_user_tags cancel_register_bd_consumer  administrator
  sudo docker container exec $SERVER  rabbitmqctl set_permissions -p / cancel_register_bd_consumer ".*" ".*" ".*"
  sudo docker container exec $SERVER  rabbitmqctl add_user create_update_register_bd create_update_register_bd
  sudo docker container exec $SERVER  rabbitmqctl set_user_tags create_update_register_bd administrator
  sudo docker container exec $SERVER  rabbitmqctl set_permissions -p / create_update_register_bd ".*" ".*" ".*"
  sudo docker container exec $SERVER  rabbitmqctl add_user create_update_register_bd_consumer create_update_register_bd_consumer
  sudo docker container exec $SERVER  rabbitmqctl set_user_tags create_update_register_bd_consumer administrator
  sudo docker container exec $SERVER  rabbitmqctl set_permissions -p / create_update_register_bd_consumer ".*" ".*" ".*"
  sudo docker container exec $SERVER rabbitmqctl add_user dead_cancel_queue dead_cancel_queue
  sudo docker container exec $SERVER rabbitmqctl set_user_tags dead_cancel_queue administrator 
  sudo docker container exec $SERVER rabbitmqctl set_permissions -p / dead_cancel_queue ".*" ".*" ".*"

  echo " "
  printf '                                                          \U2705  \U2705  \U2705  \U2705  \U2705 \n '
  echo " "
  echo 'END OF SCRIPT'