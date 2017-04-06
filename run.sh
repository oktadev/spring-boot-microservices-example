#!/bin/bash

set -e

cd `dirname $0`
r=`pwd`
echo $r

# Eureka
cd $r/eureka-service
./mvnw spring-boot:run &

# Beer Service
cd $r/beer-catalog-service
./mvnw spring-boot:run &

# Edge Service
cd $r/edge-service
./mvnw spring-boot:run &

# Client
cd $r/client
yarn
ng serve &