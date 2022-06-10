#!/bin/bash
if ping -c 1 -W 3 172.20.0.3; then
  echo "COMMANDS EXECUTE ON >>>>>>>>> RABBITMQ SERVER <<<<<<<<<<<<<"
  SERVER=rabbitmq    
elif ping -c 1 -W 3 172.21.0.3; then
  echo "COMMANDS EXECUTE ON >>>>>>>>> DEV-RABBITMQ SERVER <<<<<<<<<<<<<"
  SERVER=dev-rabbitmq
elif ping -c 1 -W 3 172.22.0.3; then
  echo "COMMANDS EXECUTE ON >>>>>>>>> 'TEST' DEV-RABBITMQ SERVER <<<<<<<<<<<<"
  SERVER=dev-rabbitmq 
else
    echo "RABBITMQ PROD AND DEV >>>>>>>>> NOT ACESSIBLE <<<<<<<<<<<< "
fi

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
