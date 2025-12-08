import CarrinhoModel from '../models/CarrinhoModel.js';
import ProdutoModel from '../models/ProdutoModel.js';

class CarrinhoController {

    // POST /api/carrinho/adicionar
    static async adicionar(req, res) {
        try {
            const { produtoId, quantidade } = req.body;
            const userId = req.usuario.id; // Corrigido: req.usuario (conforme seu middleware)

            if (!produtoId || !quantidade) {
                return res.status(400).json({
                    sucesso: false,
                    erro: "Produto e quantidade são obrigatórios"
                });
            }

            if (quantidade < 1) {
                return res.status(400).json({
                    sucesso: false,
                    erro: "Quantidade deve ser maior que zero"
                });
            }

            // Verificar se o produto existe
            const produto = await ProdutoModel.buscarPorId(produtoId);
            if (!produto) {
                return res.status(404).json({
                    sucesso: false,
                    erro: "Produto não encontrado"
                });
            }

            // Verificar se já existe no carrinho
            const itemExistente = await CarrinhoModel.buscarItem(userId, produtoId);

            if (itemExistente) {
                // Atualizar quantidade
                const novaQuantidade = itemExistente.quantidade + quantidade;
                await CarrinhoModel.atualizarQuantidade(userId, produtoId, novaQuantidade);
            } else {
                // Adicionar novo item
                await CarrinhoModel.adicionar(userId, produtoId, quantidade);
            }

            res.json({
                sucesso: true,
                mensagem: "Item adicionado ao carrinho"
            });

        } catch (error) {
            console.error("Erro ao adicionar ao carrinho:", error);
            res.status(500).json({
                sucesso: false,
                erro: "Erro interno ao adicionar ao carrinho"
            });
        }
    }

    // PUT /api/carrinho/atualizar
    static async atualizar(req, res) {
        try {
            const { produtoId, quantidade } = req.body;
            const userId = req.usuario.id;

            if (!produtoId || quantidade === undefined) {
                return res.status(400).json({
                    sucesso: false,
                    erro: "Produto e quantidade são obrigatórios"
                });
            }

            if (quantidade < 1) {
                return res.status(400).json({
                    sucesso: false,
                    erro: "Quantidade deve ser maior que zero"
                });
            }

            await CarrinhoModel.atualizarQuantidade(userId, produtoId, quantidade);

            res.json({
                sucesso: true,
                mensagem: "Carrinho atualizado"
            });

        } catch (error) {
            console.error("Erro ao atualizar carrinho:", error);
            res.status(500).json({
                sucesso: false,
                erro: "Erro interno ao atualizar carrinho"
            });
        }
    }

    // DELETE /api/carrinho/remover/:produtoId
    static async remover(req, res) {
        try {
            const { produtoId } = req.params;
            const userId = req.usuario.id;

            if (!produtoId) {
                return res.status(400).json({
                    sucesso: false,
                    erro: "ID do produto é obrigatório"
                });
            }

            await CarrinhoModel.remover(userId, produtoId);

            res.json({
                sucesso: true,
                mensagem: "Item removido do carrinho"
            });

        } catch (error) {
            console.error("Erro ao remover do carrinho:", error);
            res.status(500).json({
                sucesso: false,
                erro: "Erro interno ao remover do carrinho"
            });
        }
    }

    static async limpar(req, res) {
        try {
            const userId = req.usuario.id;
            await CarrinhoModel.limpar(userId);

            return res.json({
                sucesso: true,
                mensagem: "Carrinho limpo com sucesso"
            });
        }
        catch (error) {
            console.error("Erro ao limpar carrinho:", error);
            return res.status(500).json({
                sucesso: false,
                erro: "Erro ao limpar carrinho"
            });

        }
    }

    // GET /api/carrinho
    static async listar(req, res) {
        try {
            const userId = req.usuario.id;

            const itens = await CarrinhoModel.listarPorUsuario(userId);

            // Calcular total
            const total = itens.reduce((acc, item) => {
                return acc + (item.preco * item.quantidade);
            }, 0);

            res.json({
                sucesso: true,
                dados: {
                    itens,
                    total: total.toFixed(2)
                }
            });

        } catch (error) {
            console.error("Erro ao listar carrinho:", error);
            res.status(500).json({
                sucesso: false,
                erro: "Erro interno ao listar carrinho"
            });
        }
    }
}

export default CarrinhoController;