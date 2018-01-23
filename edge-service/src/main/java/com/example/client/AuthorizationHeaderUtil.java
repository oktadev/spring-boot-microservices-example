package com.example.client;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;

import java.util.Optional;

public class AuthorizationHeaderUtil {

    public static Optional<String> getAuthorizationHeader() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Object details = authentication.getDetails();
        if (details != null && details instanceof OAuth2AuthenticationDetails) {
            OAuth2AuthenticationDetails oAuth2AuthenticationDetails =
                (OAuth2AuthenticationDetails) details;

            return Optional.of(String.format("%s %s", oAuth2AuthenticationDetails.getTokenType(),
                oAuth2AuthenticationDetails.getTokenValue()));

        } else {
            return Optional.empty();
        }
    }
}
