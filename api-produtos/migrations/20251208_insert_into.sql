--a tabela completinha:

CREATE TABLE produtos (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    descricao TEXT,
    img VARCHAR(255),
    fornecedor VARCHAR(255),
    categoria VARCHAR(255) NOT NULL,
    estoque INT NOT NULL,
    especificacoes TEXT
);


--adicionando a tabela produtos de forma direta, sem o update.

INSERT INTO produtos 
(nome, preco, descricao, img, fornecedor, categoria, estoque, especificacoes)
VALUES
('CoroDrill® DE10', 12.50, 
 'A broca com ponta intercambiável para furação de alto volume.',
 'brocaAltaPerf.png', 'MetalMax', 'Ferramentas de Furação', 10,
 'Broca com ponta intercambiável projetada para furação de alto volume. Possui excelente rigidez, alta estabilidade térmica, geometrias otimizadas para escoamento de cavacos e compatibilidade com várias qualidades de pontas para diferentes materiais.'
);

INSERT INTO produtos 
(nome, preco, descricao, img, fornecedor, categoria, estoque, especificacoes)
VALUES
('Pinça ER', 40.50, 
 'Componente para fixar ferramentas em máquinas, garantindo precisão e segurança.',
 'pincaER.png', 'MetalMax', 'Fixação', 15,
 'Pinça padrão ER fabricada em aço tratado para alta resistência. Garante concentricidade aprimorada, excelente fixação radial e compatibilidade com porta-pinças ER16, ER20, ER25 ou ER32, dependendo do modelo. Ideal para operações de fresamento e furação de precisão.'
);

INSERT INTO produtos 
(nome, preco, descricao, img, fornecedor, categoria, estoque, especificacoes)
VALUES
('Mini Parafusadeira', 35.50, 
 'Parafusadeira compacta ideal para serviços rápidos e práticos.',
 'miniparaf.webp', 'MetalMax', 'Parafusadeiras', 210,
 'Parafusadeira compacta com design ergonômico, torque ajustável, motor de baixa vibração e mandril de engate rápido. Indicada para pequenos reparos, montagem de móveis e atividades rotineiras com longa autonomia e baixa manutenção.'
);

INSERT INTO produtos 
(nome, preco, descricao, img, fornecedor, categoria, estoque, especificacoes)
VALUES
('CoroCut® 2', 210, 
 'Ferramenta projetada para operações de corte, canal e perfilamento com alta precisão.',
 'past.png', 'Cortes', 'Cortes', 210,
 'Ferramenta modular de corte para operações de canal, perfil e faceamento. Possui sistema de fixação estável para insertos, controle aprimorado de cavacos e rigidez superior para trabalhos de alta precisão em tornos CNC.'
);

INSERT INTO produtos 
(nome, preco, descricao, img, fornecedor, categoria, estoque, especificacoes)
VALUES
('CoroMill 345', 180, 
 'Fresa de faceamento de alto desempenho, ideal para remoção de material eficiente.',
 'pfres.png', 'MetalMax', 'Usinagem', 210,
 'Fresa de faceamento com múltiplas arestas indexáveis, geometria positiva suave e ângulo de ataque otimizado para reduzir esforço de corte. Ideal para remoção rápida de material com excelente acabamento superficial e alta estabilidade.'
);

INSERT INTO produtos 
(nome, preco, descricao, img, fornecedor, categoria, estoque, especificacoes)
VALUES
('Haste Cilíndrica', 420, 
 'Haste cilíndrica compatível com o sistema CoroChuck 970, utilizada para alta precisão na fixação de ferramentas.',
 'haste.png', 'Sandvik Coromant', 'Fixação', 10,
 'Haste cilíndrica compatível com o sistema CoroChuck 970, fabricada em aço de alta dureza. Projetada para minimizar vibrações, garantir precisão dimensional, aumentar a vida útil da ferramenta e manter excelente força de aperto durante operações exigentes.'
);

INSERT INTO produtos 
(nome, preco, descricao, img, fornecedor, categoria, estoque, especificacoes)
VALUES
('Alargador CoroReamer 435', 1360, 
 'Alargador CoroReamer 435 inteiriço de metal duro, ideal para operações de furação com alta precisão dimensional.',
 'al1.png', 'Sandvik Coromant', 'Ferramentas de Furação', 10,
 'Alargador de metal duro inteiriço com alta rigidez e geometrias otimizadas para acabamento dimensional. Proporciona tolerâncias apertadas, excelente alinhamento e ótima evacuação de cavacos, garantindo furos precisos e acabamento superior.'
);
