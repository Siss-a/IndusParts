-- Migration: Criar tabela estoque
-- Data: 2025-11-18
-- Descrição: Tabela para armazenar estoque de produtos

USE produtos_api;

-- Tabela de Estoque
CREATE TABLE estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_produto) REFERENCES produtos(id)
);