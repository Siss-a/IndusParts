import ProdutoModel from '../models/ProdutoModel.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises'

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename)

class ProdutoController {
    // GET /api/produtos para listar produtos
    static async listarProdutos(req, res) {
        try {

            let pagina = parseInt(req.query.pagina) || 1;
            let limite = parseInt(req.query.limite) || 100;

            if (pagina <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Página inválida',
                    mensagem: 'A página deve ser um número positivo e diferente de zero'
                })
            }
            if (limite <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Limite inválido',
                    mensagem: 'O limite deve ser um número maior que zero'
                })
            }

            const limiteMaximo = parseInt(process.env.PAGINACAO_LIMITE_MAXIMO) || 100
            if (limite > limiteMaximo) {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Limite inválido',
                    mensagem: `O limite deve ser um número entre 1 e ${limiteMaximo}`
                })
            }

            const offset = (pagina - 1) * limite

            const resultado = await ProdutoModel.listarTodos(limite, offset)

            res.status(200).json({
                sucesso: true,
                dados: resultado.produtos,
                paginacao: {
                    pagina: resultado.pagina,
                    limite: resultado.limite,
                    total: resultado.total,
                    totalPaginas: resultado.totalPaginas
                }
            })
        } catch (err) {
            console.error('Erro ao listar produtos', err)
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível listar os produtos'
            })
        }
    }

    // GET /api/produtos/:id para listar produtos por id
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                })
            }

            const produto = await ProdutoModel.buscarPorId(id);

            if (!produto) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Produto não encontrado',
                    mensagem: `Produto com ID ${id} não foi encontrado`
                })
            }

            res.status(200).json({
                sucesso: true,
                dados: produto
            })
        } catch (err) {
            console.error('Erro ao buscar produto por ID', err)
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível buscar o produto por ID'
            })
        }
    }

    // GET /api/produtos/categoria/:categoria listar produtos por categoria
    static async buscarPorCategoria(req, res) {
        try {
            const { categoria } = req.params;

            const produtos = await ProdutoModel.buscarPorCategoria(categoria);

            if (!produtos) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Categoria não encontrada',
                    mensagem: `Produto com categoria ${categoria} não encontrado`
                });
            }
            res.status(200).json({ sucesso: true, dados: produtos });
        } catch (error) {
            console.error('Erro ao buscar produtos por categoria:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno',
                mensagem: 'Não foi possível buscar produtos por categoria'
            });
        }
    }

    // POST /api/produtos/criar criar produtos
    static async criarProduto(req, res) {
        try {
            const { nome, preco, descricao, fornecedor, categoria, estoque, especificacoes } = req.body

            const erros = []

            /* validar nome */
            if (!nome || nome.trim() === '') {
                erros.push({
                    campo: 'nome',
                    mensagem: 'Nome é obrigatório'
                })
            } else {
                if (nome.trim().length < 3) {
                    erros.push({
                        campo: 'nome',
                        mensagem: 'O nome deve ter pelo menos 3 caracteres'
                    })
                }

                if (nome.trim().length > 255) {
                    erros.push({
                        campo: 'nome',
                        mensagem: 'O nome não deve ter mais de 255 caracteres'
                    })
                }
            }


            /* validar preço */
            if (!preco || isNaN(preco) || preco <= 0) {
                erros.push({
                    campo: 'preco',
                    mensagem: 'O preço deve ser um  número positivo'
                })
            }
            /* validar estoque */
            if (estoque < 1 || estoque === 0) {
                erros.push({
                    campo: 'estoque',
                    mensagem: 'Deve ter pelo menos 1 item no estoque'
                })
            }

            /* Retornar erros de uma vez */
            if (erros.length > 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Dados inválidos',
                    detalhes: erros
                })
            }

            /* Preparar dados do produto */
            const dadosProduto = {
                nome: nome.trim(),
                preco: parseFloat(preco),
                categoria: categoria,
                estoque: estoque,
                descricao: descricao,
                fornecedor: fornecedor,
                especificacoes: especificacoes
            }

            /* Adicionar imagem */
            if (req.file) {
                dadosProduto.img = req.file.filename;
            }

            const produtoId = await ProdutoModel.criar(dadosProduto);

            res.status(201).json({
                sucesso: true,
                mensagem: 'Produto criado com sucesso',
                dados: {
                    id: produtoId,
                    ...dadosProduto
                }
            });
        } catch (error) {
            console.error('Erro ao criar produto: ', error)
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível criar o produto'
            });
        }
    }

    // DELETE /api/produtos/excluir/:id rota para excluir produtos
    static async excluirProduto(req, res) {
        try {
            const { id, img } = req.params
            //console.log('Parametros', req.params)

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                })
            }
            if (img) {
                try {
                    await fs.unlink(`./uploads/imagens/${img}`)
                    console.log('Imagem excluída com sucesso')
                } catch (err) {
                    console.error('Não foi possível deletar a imagem', err)
                }
            }

            await ProdutoModel.excluir(id)

            res.status(200).json({
                sucesso: true,
                mensagem: `Produto excluído com sucesso`
            })
            return
        } catch (err) {
            console.error('Erro ao excluir produto', err)
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível excluir o produto'
            })
        }
    }

    // PUT /api/produtos/atualizar rota para atualizar dados do produto
    static async atualizarProduto(req, res) {
        const { nome, preco, descricao, fornecedor, categoria, estoque, especificacoes } = req.body
        const id = req.params.id;

        /* Coletar erros */
        const erros = []

        // Produto atual
        const produto = await ProdutoModel.buscarPorId(id);

        /* Apagar imagem antiga */
        if (req.file && produto.img) {
            try {
                await fs.unlink(`./uploads/imagens/${produto.img}`);
                console.log("Imagem antiga removida");
            } catch (err) {
                console.warn("Não foi possível apagar a imagem antiga:", err);
            }
        }

        /* validar nome */
        if (nome !== undefined) {
            if (nome.trim() === '') {
                erros.push({
                    campo: 'nome',
                    mensagem: 'Nome não pode estar vazio'
                })
            } else if (nome.trim().length < 3) {
                erros.push({
                    campo: 'nome',
                    mensagem: 'O nome deve ter pelo menos 3 caracteres'
                })
            }
        }

        /* validar preço */
        if (preco !== undefined) {
            if (isNaN(preco) || preco <= 0) {
                erros.push({
                    campo: 'preco',
                    mensagem: 'O preço deve ser um número positivo'
                })
            }
        }

        /* validar estoque */
        if (estoque !== undefined) {
            if (isNaN(estoque) || estoque < 0) {
                erros.push({
                    campo: 'estoque',
                    mensagem: 'O estoque deve ser 0 ou maior'
                })
            }
        }

        /* Retornar erros de uma vez */
        if (erros.length > 0) {
            return res.status(400).json({
                sucesso: false,
                erro: 'Dados inválidos',
                detalhes: erros
            })
        }

        /* Preparar dados do produto */
        const dadosProduto = {};

        if (nome !== undefined) dadosProduto.nome = nome.trim();
        if (preco !== undefined) dadosProduto.preco = parseFloat(preco);
        if (categoria !== undefined) dadosProduto.categoria = categoria;
        if (estoque !== undefined) dadosProduto.estoque = parseInt(estoque);
        if (descricao !== undefined) dadosProduto.descricao = descricao;
        if (fornecedor !== undefined) dadosProduto.fornecedor = fornecedor;
        if (especificacoes !== undefined) dadosProduto.especificacoes = especificacoes;

        /* Adicionar imagem */
        if (req.file) {
            dadosProduto.img = req.file.filename;
        }


        /* Adicionar imagem */
        if (req.file) {
            dadosProduto.img = req.file.filename;
        }

        const produtoId = await ProdutoModel.atualizar(id, dadosProduto);

        res.status(201).json({
            sucesso: true,
            mensagem: 'Produto atualizado com sucesso',
            dados: {
                id: produtoId,
                ...dadosProduto
            }
        });
    }
}

export default ProdutoController;