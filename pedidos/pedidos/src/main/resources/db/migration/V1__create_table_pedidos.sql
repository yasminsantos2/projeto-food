CREATE TABLE pedidos (
                         id BIGSERIAL PRIMARY KEY,
                         data_hora TIMESTAMP NOT NULL,
                         status VARCHAR(255) NOT NULL
);