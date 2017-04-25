#!/bin/bash

set -e

cd `dirname $0`
r=`pwd`
echo $r

# Eureka
cd $r/eureka-service
mvn spring-boot:run &

# Beer Service
cd $r/beer-catalog-service
mvn spring-boot:run &

# Edge Service
cd $r/edge-service
mvn spring-boot:run &

# Client
cd $r/client
npm install
npm start