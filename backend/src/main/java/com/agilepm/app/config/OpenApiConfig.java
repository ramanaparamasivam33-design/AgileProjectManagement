package com.agilepm.app.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Agile Project Management Tool REST API")
                        .version("1.0.0")
                        .description("Production-ready RESTful APIs for managing Agile Projects, User Stories, Tasks, and Async Workflows.")
                        .contact(new Contact()
                                .name("Senior Software Architect Team")
                                .email("engineering@agilepm.io"))
                        .license(new License().name("Apache 2.0").url("https://www.apache.org/licenses/LICENSE-2.0")));
    }
}
