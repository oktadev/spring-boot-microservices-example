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



# build all the java apps
cd $r && find . -iname pom.xml | xargs -I pom  mvn -DskipTests clean install -f pom


# client first
cd $r/client
ng build --prod --aot
cd dist
touch Staticfile
cf push pwa-client   --random-route

# Eureka
#cd $r/eureka-service
#cf push -p target/*jar pwa-eureka-service
#deploy_service pwa-eureka-service

# Beer Service
#cd $r/beer-catalog-service
#cf push -p target/*jar pwa-beer-catalog-service --no-start
#cf bs pwa-beer-catalog-service  pwa-eureka-service
#cf start pwa-beer-catalog-service


# Edge Service
stormpathApiKeyId=`cat ~/.stormpath/apiKey.properties | grep apiKey.id | cut -f3 -d\ `
stormpathApiKeySecret=`cat ~/.stormpath/apiKey.properties | grep apiKey.secret | cut -f3 -d\ `

cd $r/edge-service
cf push -p target/*jar pwa-edge-service --no-start
cf set-env pwa-edge-service STORMPATH_API_KEY_ID $stormpathApiKeyId
cf set-env pwa-edge-service STORMPATH_API_KEY_SECRET $stormpathApiKeySecret
cf set-env pwa-edge-service PWA_CLIENT_URI https://`app_domain pwa-client`
cf bs pwa-edge-service pwa-eureka-service
cf start pwa-edge-service



