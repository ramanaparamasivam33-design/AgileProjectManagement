package com.agilepm.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AgileProjectManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(AgileProjectManagerApplication.class, args);
    }
}
