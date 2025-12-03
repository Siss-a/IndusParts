--- adicionando preço na tabela produtos
--- data: 03/12/25

USE indusparts;

ALTER TABLE produtos
ADD preco DECIMAL(10,2) NOT NULL DEFAULT 0;
