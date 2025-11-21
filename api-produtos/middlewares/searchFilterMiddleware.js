// middlewares/searchFilterMiddleware.js

/* Middleware para processar parâmetros de pesquisa e filtros
 Valida e prepara os dados de query para uso nos controllers */
class SearchFilterMiddleware {

    /* Middleware principal para processar pesquisa e filtros de produtos */
    static processarFiltros(req, res, next) {
        try {
            // Objeto para armazenar os filtros processados
            const filtros = {};

            // 1. PESQUISA POR TEXTO (nome ou descrição)
            if (req.query.busca) {
                const busca = req.query.busca.trim();
                if (busca.length > 0) {
                    if (busca.length > 255) {
                        return res.status(400).json({
                            sucesso: false,
                            erro: 'Termo de busca inválido',
                            mensagem: 'O termo de busca deve ter no máximo 255 caracteres'
                        });
                    }
                    filtros.busca = busca;
                }
            }

            // 2. FILTRO POR CATEGORIA
            if (req.query.categoria) {
                const categoria = req.query.categoria.trim();
                if (categoria.length > 0) {
                    filtros.categoria = categoria;
                }
            }

            // 3. FILTRO POR FAIXA DE PREÇO
            if (req.query.preco_min) {
                const precoMin = parseFloat(req.query.preco_min);
                if (isNaN(precoMin) || precoMin < 0) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Preço mínimo inválido',
                        mensagem: 'O preço mínimo deve ser um número maior ou igual a zero'
                    });
                }
                filtros.preco_min = precoMin;
            }

            if (req.query.preco_max) {
                const precoMax = parseFloat(req.query.preco_max);
                if (isNaN(precoMax) || precoMax < 0) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Preço máximo inválido',
                        mensagem: 'O preço máximo deve ser um número maior ou igual a zero'
                    });
                }
                filtros.preco_max = precoMax;
            }

            // Validar se preço mínimo não é maior que o máximo
            if (filtros.preco_min !== undefined && filtros.preco_max !== undefined) {
                if (filtros.preco_min > filtros.preco_max) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Faixa de preço inválida',
                        mensagem: 'O preço mínimo não pode ser maior que o preço máximo'
                    });
                }
            }

            // 4. ORDENAÇÃO
            const ordenacaoValida = ['nome', 'preco', 'categoria', 'created_at'];
            const direcaoValida = ['asc', 'desc'];

            if (req.query.ordenar) {
                const ordenar = req.query.ordenar.toLowerCase();
                if (!ordenacaoValida.includes(ordenar)) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Ordenação inválida',
                        mensagem: `A ordenação deve ser uma das seguintes: ${ordenacaoValida.join(', ')}`
                    });
                }
                filtros.ordenar = ordenar;
            } else {
                // Ordenação padrão
                filtros.ordenar = 'created_at';
            }

            if (req.query.direcao) {
                const direcao = req.query.direcao.toLowerCase();
                if (!direcaoValida.includes(direcao)) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Direção inválida',
                        mensagem: 'A direção deve ser "asc" (crescente) ou "desc" (decrescente)'
                    });
                }
                filtros.direcao = direcao;
            } else {
                // Direção padrão
                filtros.direcao = 'desc';
            }

            // 5. FILTRO POR DATA DE CRIAÇÃO
            if (req.query.data_inicio) {
                const dataInicio = new Date(req.query.data_inicio);
                if (isNaN(dataInicio.getTime())) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Data de início inválida',
                        mensagem: 'A data de início deve estar no formato válido (YYYY-MM-DD)'
                    });
                }
                filtros.data_inicio = req.query.data_inicio;
            }

            if (req.query.data_fim) {
                const dataFim = new Date(req.query.data_fim);
                if (isNaN(dataFim.getTime())) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Data de fim inválida',
                        mensagem: 'A data de fim deve estar no formato válido (YYYY-MM-DD)'
                    });
                }
                filtros.data_fim = req.query.data_fim;
            }

            // 6. FILTRO POR DISPONIBILIDADE DE IMAGEM
            if (req.query.com_imagem !== undefined) {
                const comImagem = req.query.com_imagem.toLowerCase();
                if (comImagem === 'true' || comImagem === '1') {
                    filtros.com_imagem = true;
                } else if (comImagem === 'false' || comImagem === '0') {
                    filtros.com_imagem = false;
                }
            }

            // Anexar filtros processados ao objeto request
            req.filtros = filtros;

            // Continuar para o próximo middleware/controller
            next();

        } catch (error) {
            console.error('Erro ao processar filtros:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível processar os filtros'
            });
        }
    }

    /**
     * Middleware para validar campos de pesquisa específicos
     */
    static validarCamposBusca(camposPermitidos = ['nome', 'descricao']) {
        return (req, res, next) => {
            if (req.query.campo_busca) {
                const campo = req.query.campo_busca.toLowerCase();
                if (!camposPermitidos.includes(campo)) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Campo de busca inválido',
                        mensagem: `O campo de busca deve ser um dos seguintes: ${camposPermitidos.join(', ')}`
                    });
                }
                req.filtros = req.filtros || {};
                req.filtros.campo_busca = campo;
            }
            next();
        };
    }

    /* Middleware para sanitizar entradas de pesquisa */
    static sanitizarBusca(req, res, next) {
        if (req.filtros && req.filtros.busca) {
            // Remove caracteres especiais perigosos para SQL
            // Mantém apenas letras, números, espaços e alguns caracteres comuns
            req.filtros.busca = req.filtros.busca
                .replace(/[<>{}]/g, '') // Remove tags HTML/JS
                .replace(/[;'"\\]/g, '') // Remove caracteres SQL perigosos
                .trim();
        }
        next();
    }

    /* Gera uma string SQL WHERE com base nos filtros
    Método auxiliar para uso nos Models */

    static gerarCondicaoSQL(filtros) {
        const condicoes = [];
        const valores = [];

        if (filtros.busca) {
            condicoes.push('(nome LIKE ? OR descricao LIKE ?)');
            const termoBusca = `%${filtros.busca}%`;
            valores.push(termoBusca, termoBusca);
        }

        if (filtros.categoria) {
            condicoes.push('categoria = ?');
            valores.push(filtros.categoria);
        }

        if (filtros.preco_min !== undefined) {
            condicoes.push('preco >= ?');
            valores.push(filtros.preco_min);
        }

        if (filtros.preco_max !== undefined) {
            condicoes.push('preco <= ?');
            valores.push(filtros.preco_max);
        }

        if (filtros.data_inicio) {
            condicoes.push('DATE(created_at) >= ?');
            valores.push(filtros.data_inicio);
        }

        if (filtros.data_fim) {
            condicoes.push('DATE(created_at) <= ?');
            valores.push(filtros.data_fim);
        }

        if (filtros.com_imagem === true) {
            condicoes.push('imagem IS NOT NULL');
        } else if (filtros.com_imagem === false) {
            condicoes.push('imagem IS NULL');
        }

        const whereClause = condicoes.length > 0
            ? `WHERE ${condicoes.join(' AND ')}`
            : '';

        return { whereClause, valores };
    }

    /**
     * Gera a cláusula ORDER BY com base nos filtros
     */
    static gerarOrdenacaoSQL(filtros) {
        const ordenar = filtros.ordenar || 'created_at';
        const direcao = filtros.direcao || 'desc';
        return `ORDER BY ${ordenar} ${direcao.toUpperCase()}`;
    }
}

export default SearchFilterMiddleware;