# Bootiful Microservices with Spring Boot

**Prerequisites**: Java 8

To run the client and all the servers, execute `./run.sh`, or execute the [commands in this file](https://github.com/oktadeveloper/spring-boot-microservices-example/blob/master/run.sh) manually.

To see how to develop an Angular client that talks to this architecture, see [Progressive Web Applications with Angular and Spring Boot](TBD). To add a PWA client to this application, run the following commands:

```
git clone https://github.com/oktadeveloper/spring-boot-angular-pwa-example
# Copy client from angular-pwa example
cp -r spring-boot-angular-pwa-example/client /path/to/this/project
# Deploy to Cloud Foundry (won't work w/o client)
sh deploy.sh
```