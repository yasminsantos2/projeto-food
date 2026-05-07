package br.com.food.pedidos.amqp;

import br.com.food.pedidos.dto.PagamentoDto;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Component
public class PagamentoListener {

    @RabbitListener(queues = "pagamento.concluido")
    public void recebeMensagem(@Payload PagamentoDto pagamento) {
        String mensagem = """
                Dados do pagamento: %s
                Número do pedido: %s
                Valor R$: %s
                Status: %s 
                """.formatted(pagamento.getId(),
                pagamento.getPedidoId(),
                pagamento.getValor(),
                pagamento.getStatus());

        System.out.println("-------------------------------------------------");
        System.out.println("NOVA MENSAGEM RECEBIDA DO RABBITMQ:");
        System.out.println(mensagem);
        System.out.println("-------------------------------------------------");
    }
}
