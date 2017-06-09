#!/bin/bash

set -e

cd `dirname $0`
r=`pwd`
echo $r

# Eureka
cd $r/eureka-service
echo "Starting Eureka Service..."
mvn -q clean spring-boot:run &

# Beer Service
echo "Starting Beer Catalog Service..."
cd $r/beer-catalog-service
mvn -q clean spring-boot:run &

# Edge Service
echo "Starting Edge Service..."
cd $r/edge-service
mvn -q clean spring-boot:run &

# Client
cd $r/client
npm install
echo "Starting Angular Client..."
npm start
