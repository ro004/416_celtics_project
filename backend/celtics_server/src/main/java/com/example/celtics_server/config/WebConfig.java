package com.example.celtics_server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//CORS = Cross-Origin Resource sharing. This file defines rules for Spring so it knows what requests, from where, can
//get through to the backend
//Tell Spring this is a configuration file
@Configuration
public class WebConfig {
    @Bean //Creates this object when application starts. WebMvcConfigurer is a Spring interface which has hooks we can override to modify the default CORS rules
    public WebMvcConfigurer corsConfigurer(){
        return new WebMvcConfigurer(){
            @Override
            public void addCorsMappings(CorsRegistry registry){ //apply new settings for CorsMappings within the registry
                registry.addMapping("/**") //applies to all api routes in general
                        .allowedOrigins("*") //allow all frontend urls to call api for now
                        .allowedMethods("GET", "POST", "PUT", "DELETE") //We only really use GET but just in case
                        .allowedHeaders("*"); //allow custom headers
            }
        };
    }
}
