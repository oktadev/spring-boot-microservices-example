#!/bin/bash

set -e

cd `dirname $0`
r=`pwd`
echo $r

# client first
cd $r/client
npm install
ng serve &

# Eureka
cd $r/eureka-service
./mvnw spring-boot:run &

# Beer Service
cd $r/beer-catalog-service
./mvnw spring-boot:run &

# Edge Service
cd $r/edge-service
./mvnw spring-boot:run &
