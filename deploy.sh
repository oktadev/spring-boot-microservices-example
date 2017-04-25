#!/bin/bash

set -e


### CloudFoundry CLI utilities

CLOUD_DOMAIN=${DOMAIN:-run.pivotal.io}
CLOUD_TARGET=api.${DOMAIN}

function login(){
    cf api | grep ${CLOUD_TARGET} || cf api ${CLOUD_TARGET} --skip-ssl-validation
    cf apps | grep OK || cf login
}

function app_domain(){
    D=`cf apps | grep $1 | tr -s ' ' | cut -d' ' -f 6 | cut -d, -f1`
    echo $D
}

function deploy_service(){
    N=$1
    D=`app_domain $N`
    JSON='{"uri":"http://'$D'"}'
    cf create-user-provided-service $N -p $JSON
}

### installation

cd `dirname $0`
r=`pwd`
echo $r

## Reset
cf d -f beer-catalog-service
cf d -f client
cf d -f eureka-service
cf d -f edge-service
cf ds -f eureka-service

cf a
cf s

# build all the java apps
cd $r && find . -iname pom.xml | xargs -I pom  mvn -DskipTests clean install -f pom

# Eureka
cd $r/eureka-service
cf push -p target/*jar eureka-service  --random-route
deploy_service eureka-service

# Beer Service
cd $r/beer-catalog-service
cf push -p target/*jar beer-catalog-service --no-start  --random-route
cf bs beer-catalog-service eureka-service
cf start beer-catalog-service

# Edge Service
cd $r/edge-service
cf push -p target/*jar edge-service --no-start -n edge-service
cf bs edge-service eureka-service
cf start edge-service

# Get the URL for the server
serverUri=https://`app_domain edge-service`

# Client 
cd $r/client
rm -rf dist
sed -i -e "s|http://localhost:8081|$serverUri|g" $r/client/src/app/shared/beer/beer.service.ts
npm install && ng build -prod --aot
python $r/sw.py
cd dist
touch Staticfile
cf push pwa-client --no-start --random-route
cf set-env pwa-client FORCE_HTTPS true
cf start pwa-client

# cleanup changed files
git checkout $r/client
rm $r/client/src/app/shared/beer/beer.service.ts-e

# show apps and URLs
cf apps
