package br.com.food.pedidos.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/ola")
    public String ola() {
        return "Aplicação pedidos rodando";
    }
}