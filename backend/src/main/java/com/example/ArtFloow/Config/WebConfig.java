package com.example.ArtFloow.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {



    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Permet toutes les URL
                        .allowedOrigins("http://localhost:4200") // Autorise l'URL du front-end
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Les méthodes autorisées
                        .allowedHeaders("*") // Autorise tous les headers
                        .allowCredentials(true); // Permet les cookies
            }
        };
    }


}