package com.example.celtics_server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories(basePackages = "com.example.celtics_server.repositories")
public class CelticsServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(CelticsServerApplication.class, args);
    }

}
