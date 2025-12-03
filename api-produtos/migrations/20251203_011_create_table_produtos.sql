--20251203_011_create_table_produtos.sql

use indusparts

create table produtos (
    id int primary key not null auto_increment,
    nome varchar(255) not null,
    preco decimal(10,2) not null,
    descricao text,
    img varchar(255) null,
    fornecedor varchar(255),
    categoria varchar(255) not null,
    estoque int not null
);