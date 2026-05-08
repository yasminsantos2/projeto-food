package br.com.food.avaliacao;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class AvaliacaoApplication {
	public static void main(String[] args) {
		SpringApplication.run(AvaliacaoApplication.class, args);
	}
}
