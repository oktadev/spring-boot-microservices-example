package com.example.edgeservice;

import com.stormpath.sdk.servlet.http.Resolver;
import com.stormpath.zuul.account.ForwardedAccountHeaderFilter;
import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ForwardedAccountRequestInterceptor implements RequestInterceptor {

    private static final Logger LOGGER = LoggerFactory.getLogger(ForwardedAccountRequestInterceptor.class);

    private final Resolver<String> valueResolver;

    public ForwardedAccountRequestInterceptor(Resolver<String> accountStringResolver) {
        this.valueResolver = accountStringResolver;
    }

    @Override
    public void apply(RequestTemplate template) {
        if (template.headers().containsKey(ForwardedAccountHeaderFilter.DEFAULT_HEADER_NAME)) {
            LOGGER.warn("The X-Forwarded-User has been already set");
        } else {
            LOGGER.debug("Constructing Header {} for Account", ForwardedAccountHeaderFilter.DEFAULT_HEADER_NAME);
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();
            template.header(ForwardedAccountHeaderFilter.DEFAULT_HEADER_NAME, valueResolver.get(request, response));
        }
    }
}