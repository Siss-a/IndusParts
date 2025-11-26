-- Migration: Criar tabela produtos
-- Data: 2025-11-18
-- Descrição: Tabela para armazenar produtos do sistema

USE indusparts;

-- Tabela de Produtos
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    img VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE,
    id_categoria INT,
      fornecedor VARCHAR(255),
    tipo VARCHAR(50),
    especificacoes TEXT,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id)
);