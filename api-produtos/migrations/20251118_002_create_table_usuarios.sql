-- Migration: Criar tabela usuarios
-- Data: 2025-11-18
-- Descrição: Tabela para armazenar usuários do sistema

USE produtos_api;


-- Tabela de Usuários/Empresas
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_social VARCHAR(255) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20)
);












