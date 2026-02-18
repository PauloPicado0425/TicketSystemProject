
package com.paulo.ticketsystem.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI ticketSystemOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Ticket System API")
                        .description("API para gestión de tickets (CRUD + filtros + paginación)")
                        .version("1.0.0"));
    }
}
