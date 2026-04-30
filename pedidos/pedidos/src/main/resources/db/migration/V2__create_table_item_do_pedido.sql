CREATE TABLE item_do_pedido (
                                id BIGSERIAL PRIMARY KEY,
                                descricao VARCHAR(255),
                                quantidade INTEGER NOT NULL,
                                pedido_id BIGINT NOT NULL,
                                CONSTRAINT fk_item_do_pedido_pedido
                                    FOREIGN KEY (pedido_id)
                                        REFERENCES pedidos(id)
);