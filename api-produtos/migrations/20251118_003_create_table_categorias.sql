-- Migration: Criar tabela categorias
-- Data: 2025-11-18
-- Descrição: Tabela para armazenar as categorias de produtos

USE produtos_api;

-- Tabela de Categorias
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT
);