import PedidoModel from '../models/PedidoModel.js';
import CarrinhoModel from '../models/CarrinhoModel.js';
import ProdutoModel from '../models/ProdutoModel.js';

class PedidoController {

    // POST /api/pedidos
    static async criar(req, res) {
        try {
            const userId = req.usuario.id; 

            // Pegar itens do carrinho
            const itensCarrinho = await CarrinhoModel.listarPorUsuario(userId);

            if (itensCarrinho.length === 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: "Carrinho vazio"
                });
            }

            // Validar estoque e calcular total
            let total = 0;
            for (const item of itensCarrinho) {
                const produto = await ProdutoModel.buscarPorId(item.produto_id);

                if (!produto) {
                    return res.status(404).json({
                        sucesso: false,
                        erro: `Produto ID ${item.produto_id} não existe`
                    });
                }

                if (produto.estoque < item.quantidade) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: `Estoque insuficiente para ${produto.nome}`
                    });
                }

                total += produto.preco * item.quantidade;
            }

            // Criar pedido
            const pedidoId = await PedidoModel.criarPedido(userId, total);

            // Criar itens do pedido + descontar estoque
            for (const item of itensCarrinho) {
                const produto = await ProdutoModel.buscarPorId(item.produto_id);

                // Registrar item do pedido
                await PedidoModel.adicionarItem(
                    pedidoId,
                    item.produto_id,
                    item.quantidade,
                    produto.preco
                );

                // Descontar estoque
                await ProdutoModel.descontarEstoque(
                    item.produto_id,
                    item.quantidade
                );
            }

            // Limpar carrinho
            await CarrinhoModel.limpar(userId);

            return res.status(201).json({
                sucesso: true,
                mensagem: "Pedido criado com sucesso",
                dados: {
                    pedidoId,
                    total: total.toFixed(2)
                }
            });

        } catch (error) {
            console.error("Erro ao criar pedido:", error);
            return res.status(500).json({
                sucesso: false,
                erro: "Erro interno ao criar pedido"
            });
        }
    }

    // GET /api/pedidos
    static async listarDoUsuario(req, res) {
        try {
            const userId = req.usuario.id;

            const pedidos = await PedidoModel.listarPorUsuario(userId);

            return res.json({
                sucesso: true,
                dados: pedidos
            });

        } catch (error) {
            console.error("Erro ao listar pedidos:", error);
            return res.status(500).json({
                sucesso: false,
                erro: "Erro interno ao listar pedidos"
            });
        }
    }
}

export default PedidoController;