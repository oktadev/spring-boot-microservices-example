# Bootiful Microservices with Spring Boot

This example shows how to create a microservices architecture with Spring Boot and display its data with an Angular UI.

Please read [Build a Microservices Architecture for Microbrews with Spring Boot](https://developer.okta.com/blog/2017/06/15/build-microservices-architecture-spring-boot) for a tutorial that shows you how to build this application.

**Prerequisites:** [Java 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) and [Node.js](https://nodejs.org/).

> [Okta](https://developer.okta.com/) has Authentication and User Management APIs that reduce development time with instant-on, scalable user infrastructure. Okta's intuitive API and expert support make it easy for developers to authenticate, manage and secure users and roles in any application.

* [Getting Started](#getting-started)
* [Help](#help)
* [Links](#links)
* [License](#license)

## Getting Started

To install this example application, run the following commands:

```bash
git clone https://github.com/oktadeveloper/spring-boot-microservices-example.git
cd spring-boot-microservices-example
```

This will get a copy of the project installed locally. To run the client and all the servers, execute `./run.sh`, or execute the [commands in this file](https://github.com/oktadeveloper/spring-boot-microservices-example/blob/master/run.sh) manually.

```bash
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
```

The primary example (without authentication) is in the `master` branch. A pure Spring Security OAuth implementation is in an `oauth` branch, and an example with the Stormpath SDK is in the `okta` branch. Both branches use the Okta Sign-In Widget on the front end. 

### Spring Security OAuth

Okta implements the [OAuth 2.0](https://oauth.net/) protocol for its API. This means you can use libraries like [Spring Security OAuth](http://projects.spring.io/spring-security-oauth/) to provide single sign-on to your applications. 

To check out the branch that uses Spring Security OAuth, run the following command.

```bash
git checkout oauth
```

The code in the `oauth` branch is described in [Secure a Spring Microservices Architecture with Spring Security and OAuth 2.0](https://developer.okta.com/blog/2018/02/13/secure-spring-microservices-with-oauth).

> The changes required to move from the Stormpath SDK to Spring Security OAuth can be viewed in [pull request #8](https://github.com/oktadeveloper/spring-boot-microservices-example/pull/8/files).

### Create Applications in Okta

If you don't have one, [create an Okta Developer account](https://developer.okta.com/signup/). After you've completed the setup process, log in to your account and navigate to **Applications** > **Add Application**. Click **Web** and **Next**. On the next page, enter the following values and click **Done**.

* Application Name: `Spring OAuth`
* Base URIs: `http://localhost:8081`
* Login redirect URIs: `http://localhost:8081/login`

You need to add a `roles` claim to your ID Token, so your groups in Okta are translated to Spring Security authorities. In your Okta developer console, navigate to **API** > **Authorization Servers**, click the **Authorization Servers** tab and edit the default one. Click the **Claims** tab and **Add Claim**. Name it "roles" and include it in the ID Token. Set the value type to "Groups" and set the filter to be a Regex of `.*`.

Change `security.oauth2.*` properties in the following files to enter your client ID and client secret. 

* [edge-service/src/main/resources/application.properties](../../tree/oauth/edge-service/src/main/resources/application.properties)
* [beer-catalog-service/src/main/resources/application.properties](../../tree/oauth/beer-catalog-service/src/main/resources/application.properties)

You can also create a `~/.okta.env` file to override the properties in these files.

```bash
#!/bin/bash

# Okta with JHipster
export SECURITY_OAUTH2_CLIENT_ACCESS_TOKEN_URI="https://{yourOktaDomain}.com/oauth2/default/v1/token"
export SECURITY_OAUTH2_CLIENT_USER_AUTHORIZATION_URI="https://{yourOktaDomain}.com/oauth2/default/v1/authorize"
export SECURITY_OAUTH2_RESOURCE_USER_INFO_URI="https://{yourOktaDomain}.com/oauth2/default/v1/userinfo"
export SECURITY_OAUTH2_RESOURCE_TOKEN_INFO_URI="https://{yourOktaDomain}.com/oauth2/default/v1/introspect"
export SECURITY_OAUTH2_CLIENT_CLIENT_ID="{clientId}"
export SECURITY_OAUTH2_CLIENT_CLIENT_SECRET="{clientSecret}"
```

Then run the following before starting any servers.

```source
source ~/.okta.env
```

To use Okta's Sign-In Widget, you'll need to modify your app in Okta to enable an *Implicit* grant type. Log in to your account, navigate to **Applications** > **Spring OAuth** > **General** tab and click **Edit**. Enable **Implicit (Hybrid)** under **Allowed grant types** and select both checkboxes below it. Add `http://localhost:4200` under **Login redirect URIs** and click **Save**.

In order for the Sign-In Widget to make requests to this application, you'll also need to configure the client URL as a trusted origin. Click **API** > **Trusted Origins** > **Add Origin**. Enter `http://localhost:4200` as the **Origin URL** and select both checkboxes under it.

Change `{clientId}` and `{yourOktaDomain}` in `client/src/app/shared/okta/okta.service.ts` to match your app's values.

```typescript
signIn = new OktaSignIn({
  baseUrl: 'https://{yourOktaDomain}.com',
  clientId: '{clientId}',
  authParams: {
    issuer: 'default',
    responseType: ['id_token', 'token'],
    scopes: ['openid', 'email', 'profile']
  }
});
```

### Stormpath SDK

To check out the branch that uses the Stormpath SDK, run the following command.

```bash
git checkout okta
```

The code in the `okta` branch is described in [Secure a Spring Microservices Architecture with Spring Security, JWTs, Juiser, and Okta](https://developer.okta.com/blog/2017/08/08/secure-spring-microservices).

### Create Applications in Okta

You will need to [create an Okta developer account](https://github.com/stormpath/stormpath-sdk-java/blob/okta/OktaGettingStarted.md) to configure the Spring Boot side of things. After creating an app and an access token, you should be able to set the following environment variables:

```bash
export STORMPATH_CLIENT_BASEURL={baseUrl}
export OKTA_APPLICATION_ID={applicationId}
export OKTA_API_TOKEN={apiToken}
export OKTA_AUTHORIZATIONSERVER_ID=default
```

After you set these environment variables, make sure to restart your Spring Boot applications.

For Angular, you'll need to create an OIDC app on Okta. Change `{clientId}` and `{yourOktaDomain}` in `client/src/app/shared/okta/okta.service.ts` to match your app's values.

```typescript
signIn = new OktaSignIn({
  baseUrl: 'https://{yourOktaDomain}.com',
  clientId: '{clientId}',
  authParams: {
    issuer: 'default',
    responseType: ['id_token', 'token'],
    scopes: ['openid', 'email', 'profile']
  }
});
```

**NOTE:** The value of `{yourOktaDomain}` should be something like `dev-123456.oktapreview.com`. Make sure you don't include `-admin` in the value!

After making these changes, you should be able to log in with your credentials at `http://localhost:4200`.

## Links

This example uses the following libraries provided by Okta:

* [Stormpath Java SDK](https://github.com/stormpath/stormpath-sdk-java)
* [Okta Sign-In Widget](https://github.com/okta/okta-signin-widget)

## Help

Please post any questions as comments on the following blog posts, or visit our [Okta Developer Forums](https://devforum.okta.com/). You can also email developers@okta.com if would like to create a support ticket.

* [Build a Microservices Architecture for Microbrews with Spring Boot](https://developer.okta.com/blog/2017/06/15/build-microservices-architecture-spring-boot)
* [Secure a Spring Microservices Architecture with Spring Security, JWTs, Juiser, and Okta](https://developer.okta.com/blog/2017/08/08/secure-spring-microservices)
* [Secure a Spring Microservices Architecture with Spring Security and OAuth 2.0](https://developer.okta.com/blog/2018/02/13/secure-spring-microservices-with-oauth)

## License

Apache 2.0, see [LICENSE](LICENSE).
