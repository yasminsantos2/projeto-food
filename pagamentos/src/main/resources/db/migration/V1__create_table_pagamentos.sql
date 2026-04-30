CREATE TABLE pagamentos (
                            id BIGSERIAL PRIMARY KEY,
                            valor NUMERIC(19, 2) NOT NULL,
                            nome VARCHAR(100),
                            numero VARCHAR(19),
                            expiracao VARCHAR(7),
                            codigo VARCHAR(3),
                            status VARCHAR(255) NOT NULL,
                            forma_de_pagamento_id BIGINT NOT NULL,
                            pedido_id BIGINT NOT NULL
);