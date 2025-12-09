-- Migration: Criar tabela pedidos
-- Data: 2025-11-18
-- Descrição: Tabela para armazenar os pedidos realizados

USE indusparts;

-- Tabela de Pedidos
CREATE TABLE pedidos (
    id int auto_increment primary key,
    empresa_id int not null,
    total decimal(10,2),
    status ENUM ('carrinho', 'pendente', 'pago', 'enviado', 'finalizado') default 'carrinho',   
    data_pedido datetime default current_timestamp
    
    FOREIGN KEY (empresa_id) REFERENCES usuarios(id)
);