package com.portfoliocms.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.portfoliocms.backend")
public class PortfolioCmsBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(PortfolioCmsBackendApplication.class, args);
	}

}
