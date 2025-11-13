-- Migration: Remover tabelas antigas
-- Data: 2025-11-13
-- Descrição: Remove as tabelas do sistema antigo de produtos

USE produtos_api;

-- Desabilitar verificação de chaves estrangeiras temporariamente
SET FOREIGN_KEY_CHECKS = 0;

-- Remover tabelas antigas
DROP TABLE IF EXISTS logs;
DROP TABLE IF EXISTS produtos;
DROP TABLE IF EXISTS usuarios;

-- Reabilitar verificação de chaves estrangeiras
SET FOREIGN_KEY_CHECKS = 1;