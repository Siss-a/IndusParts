-- 05/12/25

use indusparts;

-- desativando a proteção temporariamente 

SET SQL_SAFE_UPDATES = 0;

UPDATE produtos
SET especificacoes ='Broca com ponta intercambiável projetada para furação de alto volume. Possui excelente rigidez, alta estabilidade térmica, geometrias otimizadas para escoamento de cavacos e compatibilidade com várias qualidades de pontas para diferentes materiais.'
WHERE nome = 'CoroDrill® DE10';

UPDATE produtos
SET especificacoes = 'Pinça padrão ER fabricada em aço tratado para alta resistência. Garante concentricidade aprimorada, excelente fixação radial e compatibilidade com porta-pinças ER16, ER20, ER25 ou ER32, dependendo do modelo. Ideal para operações de fresamento e furação de precisão.'
WHERE nome = 'Pinça ER';

UPDATE produtos
SET especificacoes = 'Parafusadeira compacta com design ergonômico, torque ajustável, motor de baixa vibração e mandril de engate rápido. Indicada para pequenos reparos, montagem de móveis e atividades rotineiras com longa autonomia e baixa manutenção.'
WHERE nome = 'Mini Parafusadeira';

UPDATE produtos
SET especificacoes = 'Ferramenta modular de corte para operações de canal, perfil e faceamento. Possui sistema de fixação estável para insertos, controle aprimorado de cavacos e rigidez superior para trabalhos de alta precisão em tornos CNC.'
WHERE nome = 'CoroCut® 2';

UPDATE produtos
SET especificacoes = 'Fresa de faceamento com múltiplas arestas indexáveis, geometria positiva suave e ângulo de ataque otimizado para reduzir esforço de corte. Ideal para remoção rápida de material com excelente acabamento superficial e alta estabilidade.'
WHERE nome = 'CoroMill 345';

UPDATE produtos
SET especificacoes = 'Haste cilíndrica compatível com o sistema CoroChuck 970, fabricada em aço de alta dureza. Projetada para minimizar vibrações, garantir precisão dimensional, aumentar a vida útil da ferramenta e manter excelente força de aperto durante operações exigentes.'
WHERE nome = 'Haste Cilíndrica';

UPDATE produtos
SET especificacoes = 'Alargador de metal duro inteiriço com alta rigidez e geometrias otimizadas para acabamento dimensional. Proporciona tolerâncias apertadas, excelente alinhamento e ótima evacuação de cavacos, garantindo furos precisos e acabamento superior.'
WHERE nome = 'Alargador CoroReamer 435';

-- ativando novamente a proteção

SET SQL_SAFE_UPDATES = 1;