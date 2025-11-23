-- Migration: Criar tabela pedido_itens
-- Data: 2025-11-18
-- Descrição: Tabela para armazenar os itens dos pedidos realizados

USE indusparts;

-- Tabela de Itens do Pedido (opcional, mas recomendada)
CREATE TABLE pedido_itens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id),
    FOREIGN KEY (id_produto) REFERENCES produtos(id)
);