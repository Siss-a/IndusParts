-- Migration: Criar tabela carrinho e carrinho_itens
-- Data: 2025-11-127
-- Descrição: Tabela para armazenar os itens do carrinho

-- Tabelas do Carrinho

-- Itens do carrinho
create table carrinho_itens (
    id int auto_increment primary key,
    pedido_id int not null,
    produto_id int not null
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    data_compra DATETIME DEFAULT CURRENT_TIMESTAMP,

    foreign key (pedido_id) references pedidos(id)
);
