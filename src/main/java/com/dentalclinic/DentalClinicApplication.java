package com.dentalclinic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Entry Point for Smita Dental Clinic & Implant Centre Application.
 * Configured with Spring Boot 3.x, Spring Data JPA, and RESTful MVC Architecture.
 *
 * Designed for Academic Evaluation & Enterprise Deployment.
 */
@SpringBootApplication
public class DentalClinicApplication {

    public static void main(String[] args) {
        SpringApplication.run(DentalClinicApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" Smita Dental Clinic Backend Running on Port 8080");
        System.out.println(" Swagger API UI: http://localhost:8080/swagger-ui.html");
        System.out.println("=================================================");
    }
}
