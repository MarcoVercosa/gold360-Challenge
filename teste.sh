#!/bin/sh

if ping -c 1 -W 3 128.0.0.1; then
  echo " is alive"
else
  echo "is pining for the fjords"
fi
