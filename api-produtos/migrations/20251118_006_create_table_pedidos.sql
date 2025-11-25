-- Migration: Criar tabela pedidos
-- Data: 2025-11-18
-- Descrição: Tabela para armazenar os pedidos realizados

USE indusparts;

-- Tabela de Pedidos
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_pedido VARCHAR(50) UNIQUE NOT NULL,
    id_cliente_empresa INT NOT NULL,
    status ENUM ('pendente', 'pago', 'enviado', 'cancelado') DEFAULT 'pendente',
    data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    endereco VARCHAR(255),
    FOREIGN KEY (id_cliente_empresa) REFERENCES usuarios (id)
);