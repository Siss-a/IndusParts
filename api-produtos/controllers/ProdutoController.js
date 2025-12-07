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

    static async criarProduto(req, res) {
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

        /* validar estoque */
        if (estoque < 1 || estoque === 0) {
            erros.push({
                campo: 'estoque',
                mensagem: 'Deve ter pelo menos 1 item no estoque'
            })
        }
    }
}

export default ProdutoController;

/* import ProdutoModel from '../models/ProdutoModel.js';
import { fileURLToPath } from 'url';
import path from 'path';
// import fs from 'fs/promises'
import { removerArquivoAntigo } from '../middlewares/uploadMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProdutoController {
    // GET /produtos
    static async listarTodos(req, res) {
        try {
            let pagina = parseInt(req.query.pagina) || 1;
            let limite = parseInt(req.query.limite) || 10;

            if (pagina <= 0 || limite <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Parâmetros inválidos'
                });
            }

            const limiteMaximo = parseInt(process.env.PAGINACAO_LIMITE_MAXIMO) || 100;
            if (limite > limiteMaximo) {
                return res.status(400).json({
                    sucesso: false,
                    erro: `Limite máximo permitido é ${limiteMaximo}`
                });
            }

            const offset = (pagina - 1) * limite;

            // 🎯 CORREÇÃO AQUI: Desestruturamos a resposta para que ela seja enviada corretamente.
            // Assumindo que ProdutoModel.listarTodos retorna um objeto: { produtos: [...], total: N, totalPaginas: N }
            const { produtos, total, totalPaginas } = await ProdutoModel.listarTodos(limite, offset);

            res.status(200).json({
                sucesso: true,
                dados: produtos, // ⬅️ Agora retorna APENAS o array de produtos
                paginacao: {
                    pagina,
                    limite,
                    total: total, // ⬅️ Usamos a variável desestruturada 'total'
                    totalPaginas: totalPaginas // ⬅️ Usamos a variável desestruturada 'totalPaginas'
                }
            });

        } catch (error) {
            console.error('Erro ao listar produtos:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno' });
        }
    }

    // GET /produtos/:id
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({ sucesso: false, erro: 'ID inválido' });
            }

            const produto = await ProdutoModel.buscarPorId(id);

            if (!produto) {
                return res.status(404).json({ sucesso: false, erro: 'Produto não encontrado' });
            }

            res.status(200).json({ sucesso: true, dados: produto });

        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno' });
        }
    }

    // GET /produtos/categoria/:categoria
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

    // POST /produtos
    static async criarProduto(req, res) {
        try {
            const { nome, descricao, categoria, fornecedor, estoque, preco, especificacoes } = req.body;

            const erros = [];

            if (!nome || nome.trim().length < 3) {
                erros.push({ campo: 'nome', mensagem: 'Nome deve ter pelo menos 3 caracteres' });
            }

            if (preco === undefined || preco === null || isNaN(Number(preco))) {
                erros.push({ campo: 'preco', mensagem: 'Preço é obrigatório e deve ser numérico' });
            }

            if (estoque === undefined || estoque === null || isNaN(Number(estoque))) {
                erros.push({ campo: 'estoque', mensagem: 'Estoque é obrigatório e deve ser numérico' });
            }

            if (!categoria) {
                erros.push({ campo: 'categoria', mensagem: 'Categoria é obrigatória' });
            }

            if (erros.length > 0) {
                return res.status(400).json({ sucesso: false, erros });
            }

            const dadosProduto = {
                nome: nome.trim(),
                descricao: descricao ?? null,
                img: req.file ? req.file.filename : null,
                categoria,
                fornecedor: fornecedor ?? null,
                estoque: parseInt(estoque),
                preco: parseFloat(preco),
                especificacoes: especificacoes ?? null,
            };

            const produtoId = await ProdutoModel.criar(dadosProduto);

            res.status(201).json({
                sucesso: true,
                mensagem: 'Produto criado',
                dados: { id: produtoId, ...dadosProduto }
            });

        } catch (error) {
            console.error('Erro ao criar produto:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno' });
        }
    }



    // PUT /produtos/:id
    static async atualizar(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({ sucesso: false, erro: 'ID inválido' });
            }

            const produtoExistente = await ProdutoModel.buscarPorId(id);
            if (!produtoExistente) {
                return res.status(404).json({ sucesso: false, erro: 'Produto não encontrado' });
            }

            const { nome, descricao, categoria, fornecedor, estoque, preco, especificacoes } = req.body;

            const dadosAtualizacao = {
                nome: nome ?? produtoExistente.nome,
                descricao: descricao ?? produtoExistente.descricao,
                categoria: categoria ?? produtoExistente.categoria,
                fornecedor: fornecedor ?? produtoExistente.fornecedor,
                estoque: estoque ?? produtoExistente.estoque,
                preco: preco ?? produtoExistente.preco,
                especificacoes: especificacoes ?? produtoExistente.especificacoes,
            };

            if (req.file) {
                if (produtoExistente.img) {
                    await removerArquivoAntigo(produtoExistente.img, 'img');
                }
                dadosAtualizacao.img = req.file.filename;
            }

            await ProdutoModel.atualizar(id, dadosAtualizacao);

            res.status(200).json({ sucesso: true, mensagem: 'Produto atualizado' });

        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno' });
        }
    }


    // DELETE /produtos/:id
    static async excluir(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({ sucesso: false, erro: 'ID inválido' });
            }

            const produto = await ProdutoModel.buscarPorId(id);
            if (!produto) {
                return res.status(404).json({ sucesso: false, erro: 'Produto não encontrado' });
            }

            if (produto.img) {
                await removerArquivoAntigo(produto.img, 'img');
            }

            await ProdutoModel.excluir(id);

            res.status(200).json({ sucesso: true, mensagem: 'Produto excluído' });

        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno' });
        }
    }


    // POST /produtos/upload
    static async uploadImagem(req, res) {
        try {
            const { produto_id } = req.body;

            if (!produto_id || isNaN(produto_id)) {
                return res.status(400).json({ sucesso: false, erro: 'ID inválido' });
            }

            if (!req.file) {
                return res.status(400).json({ sucesso: false, erro: 'Imagem não enviada' });
            }

            const produto = await ProdutoModel.buscarPorId(produto_id);
            if (!produto) {
                return res.status(404).json({ sucesso: false, erro: 'Produto não encontrado' });
            }

            if (produto.img) {
                await removerArquivoAntigo(produto.img, 'img');
            }

            await ProdutoModel.atualizar(produto_id, { img: req.file.filename });

            res.status(200).json({
                sucesso: true,
                mensagem: 'Imagem atualizada',
                arquivo: req.file.filename
            });

        } catch (error) {
            console.error('Erro upload:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno' });
        }
    }
}

export default ProdutoController; */