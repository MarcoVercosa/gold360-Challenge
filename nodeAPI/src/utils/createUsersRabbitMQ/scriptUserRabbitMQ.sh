#!/bin/bash

sudo docker container exec rabbitmq rabbitmqctl add_user cancel_register_bd cancel_register_bd
sudo docker container exec rabbitmq rabbitmqctl set_user_tags cancel_register_bd  administrator
sudo docker container exec rabbitmq rabbitmqctl set_permissions -p / cancel_register_bd ".*" ".*" ".*"

sudo docker container exec rabbitmq rabbitmqctl add_user cancel_register_bd_consumer cancel_register_bd_consumer
sudo docker container exec rabbitmq rabbitmqctl set_user_tags cancel_register_bd_consumer  administrator
sudo docker container exec rabbitmq rabbitmqctl set_permissions -p / cancel_register_bd_consumer ".*" ".*" ".*"

sudo docker container exec rabbitmq rabbitmqctl add_user create_update_register_bd create_update_register_bd
sudo docker container exec rabbitmq rabbitmqctl set_user_tags create_update_register_bd administrator
sudo docker container exec rabbitmq rabbitmqctl set_permissions -p / create_update_register_bd ".*" ".*" ".*"

sudo docker container exec rabbitmq rabbitmqctl add_user create_update_register_bd_consumer create_update_register_bd_consumer
sudo docker container exec rabbitmq rabbitmqctl set_user_tags create_update_register_bd_consumer administrator
sudo docker container exec rabbitmq rabbitmqctl set_permissions -p / create_update_register_bd_consumer ".*" ".*" ".*"

sudo docker container exec rabbitmq rabbitmqctl add_user dead_cancel_queue dead_cancel_queue
sudo docker container exec rabbitmq rabbitmqctl set_user_tags dead_cancel_queue administrator 
sudo docker container exec rabbitmq rabbitmqctl set_permissions -p / dead_cancel_queue ".*" ".*" ".*"



