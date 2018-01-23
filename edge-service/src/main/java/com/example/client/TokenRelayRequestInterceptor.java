package com.example.client;

import feign.RequestInterceptor;
import feign.RequestTemplate;

public class TokenRelayRequestInterceptor implements RequestInterceptor {

    public static final String AUTHORIZATION = "Authorization";

    @Override
    public void apply(RequestTemplate template) {
        if (AuthorizationHeaderUtil.getAuthorizationHeader().isPresent()) {
            template.header(AUTHORIZATION, AuthorizationHeaderUtil.getAuthorizationHeader().get());
        }
    }
}
