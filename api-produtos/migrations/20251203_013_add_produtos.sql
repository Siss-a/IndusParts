--- adicionando preço na tabela produtos
--- data: 03/12/25

USE indusparts;

INSERT INTO produtos 
(nome, preco, descricao, img, fornecedor, categoria, estoque)
VALUES
('CoroDrill® DE10', 12.50, 'A broca com ponta intercambiável para furação de alto volume.', NULL, 'MetalMax', 'brocas', 10);

INSERT INTO produtos 
(nome, preco, descricao, img, fornecedor, categoria, estoque)
VALUES
('Pinça ER', 40.50, 'Componente para fixar ferramentas em máquinas, garantindo precisão e segurança.', NULL, 'MetalMax', 'Acessórios de Fixação', 15);

INSERT INTO produtos 
(nome, preco, descricao, img, fornecedor, categoria, estoque)
VALUES
('Mini Parafusadeira', 35.50, 'Componente para fixar ferramentas em máquinas, garantindo precisão e segurança.', NULL, 'MetalMax', 'brocas',210);


INSERT INTO produtos 
(nome, preco, descricao, img, fornecedor, categoria, estoque)
VALUES
('CoroCut® 2', 210, 'Pastilha de usinagem projetada para operações de perfilamento com alta precisão.', NULL, 'Cortes', 'brocas',210);

INSERT INTO produtos 
(nome, preco, descricao, img, fornecedor, categoria, estoque)
VALUES
('CoroMill 345', 180, 'Fresa de faceamento de alto desempenho, projetada para oferecer remoção de material eficiente', NULL, 'MetalMax', 'fresas',210);

INSERT INTO produtos 
(nome, preco, descricao, img, fornecedor, categoria, estoque)
VALUES
(
    'Haste Cilíndrica',
    420,
    'Haste cilíndrica compatível com o sistema CoroChuck 970, utilizada para alta precisão na fixação de ferramentas.',
    '../imagens/produtos/haste/haste.png',
    'Sandvik Coromant',
    'Acessórios de Fixação',
    10
);

INSERT INTO produtos 
(nome, preco, descricao, img, fornecedor, categoria, estoque)
VALUES
(
    'Alargador CoroReamer 435',
    1360,
    'Alargador CoroReamer 435 inteiriço de metal duro, ideal para operações de furação com alta precisão dimensional.',
    '../imagens/produtos/alargador/al1.png',
    'Sandvik Coromant',
    'Ferramentas de Furação',
    10
);