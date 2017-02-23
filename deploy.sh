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
cf d -f pwa-beer-catalog-service
cf d -f pwa-client
cf d -f pwa-eureka-service
cf d -f pwa-edge-service
cf ds -f pwa-eureka-service

cf a
cf s

# build all the java apps
cd $r && find . -iname pom.xml | xargs -I pom  mvn -DskipTests clean install -f pom

# client first
cd $r/client
rm -rf dist
npm install && ng build --prod --aot
python $r/sw.py
cd dist
touch Staticfile
cf push pwa-client --no-start --random-route
cf set-env pwa-client FORCE_HTTPS true
cf start pwa-client

# Get the URL for the client
clientUri=https://`app_domain pwa-client`

# replace the client URL in the server
sed -i -e "s|http://localhost:4200|$clientUri|g" $r/edge-service/src/main/resources/application.properties
# repackage the edge-service
cd $r/edge-service
mvn package -DskipTests

# Eureka
cd $r/eureka-service
cf push -p target/*jar pwa-eureka-service  --random-route
deploy_service pwa-eureka-service

# Beer Service
cd $r/beer-catalog-service
cf push -p target/*jar pwa-beer-catalog-service --no-start  --random-route
cf bs pwa-beer-catalog-service  pwa-eureka-service
cf start pwa-beer-catalog-service

# Edge Service
stormpathApiKeyId=`cat ~/.stormpath/apiKey.properties | grep apiKey.id | cut -f3 -d\ `
stormpathApiKeySecret=`cat ~/.stormpath/apiKey.properties | grep apiKey.secret | cut -f3 -d\ `

cd $r/edge-service
cf push -p target/*jar pwa-edge-service --no-start -n pwa-edge-service
cf set-env pwa-edge-service STORMPATH_API_KEY_ID $stormpathApiKeyId
cf set-env pwa-edge-service STORMPATH_API_KEY_SECRET $stormpathApiKeySecret
#cf set-env pwa-edge-service PWA_CLIENT_URI https://`app_domain pwa-client`
cf bs pwa-edge-service pwa-eureka-service
cf start pwa-edge-service

# cleanup changed files
git checkout $r/edge-service
rm $r/edge-service/src/main/resources/application.properties-e

# show apps and URLs
cf apps
