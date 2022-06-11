#!/bin/bash

echo "CREANTING IF NOT EXISTS STRUCTURE VOLUMES DIRECTORY DOCKER"
mkdir -p ./vols_containers 
mkdir -p ./vols_containers/dataBase
mkdir -p ./vols_containers/dataBase/dataBaseDEV
mkdir -p ./vols_containers/dataBase/dataBaseProd
mkdir -p ./vols_containers/ELK
mkdir -p ./vols_containers/logs
mkdir -p ./vols_containers/rabbitmq
mkdir -p ./vols_containers/rabbitmq/data
mkdir -p ./vols_containers/rabbitmq/log
echo "APPLYING PERMISSION"
chmod 777 -R ./*
echo "DIRECTORY STRUCTURE CREATION COMPLETED SUCCESSFULLY."
