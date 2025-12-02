import ProdutoModel from '../models/ProdutoModel.js';
import { fileURLToPath } from 'url';
import path from 'path';
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
        const resultado = await ProdutoModel.listarTodos(limite, offset);

        res.status(200).json({
            sucesso: true,
            dados: resultado,  // ✅ Agora retorna { produtos, total, totalPaginas }
            paginacao: { 
                pagina, 
                limite,
                total: resultado.total,
                totalPaginas: resultado.totalPaginas
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


    // POST /produtos
    static async criarProduto(req, res) {
        try {
            const { nome, descricao, id_categoria, fornecedor, tipo, especificacoes, ativo } = req.body;

            const erros = [];

            if (!nome || nome.trim().length < 3) {
                erros.push({ campo: 'nome', mensagem: 'Nome deve ter pelo menos 3 caracteres' });
            }

            if (erros.length > 0) {
                return res.status(400).json({ sucesso: false, erros });
            }

            const dadosProduto = {
                nome: nome.trim(),
                descricao: descricao || null,
                img: req.file ? req.file.filename : null,
                id_categoria: id_categoria || null,
                fornecedor: fornecedor || null,
                tipo: tipo || null,
                especificacoes: especificacoes || null,
                ativo: ativo ?? true
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

            const { nome, descricao, id_categoria, fornecedor, tipo, especificacoes, ativo } = req.body;

            const dadosAtualizacao = {
                nome: nome ?? produtoExistente.nome,
                descricao: descricao ?? produtoExistente.descricao,
                id_categoria: id_categoria ?? produtoExistente.id_categoria,
                fornecedor: fornecedor ?? produtoExistente.fornecedor,
                tipo: tipo ?? produtoExistente.tipo,
                especificacoes: especificacoes ?? produtoExistente.especificacoes,
                ativo: ativo ?? produtoExistente.ativo
            };

            if (req.file) {
                if (produtoExistente.img) {
                    await removerArquivoAntigo(produtoExistente.img, 'imagem');
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
                await removerArquivoAntigo(produto.img, 'imagem');
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
                await removerArquivoAntigo(produto.img, 'imagem');
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

export default ProdutoController;