// controllers/PedidoController.js
import CarrinhoModel from "../models/CarrinhoModel.js";
import PedidoModel from "../models/PedidoModel.js";

class PedidoController {
  // POST /pedidos/checkout -> { endereco }
  static async checkout(req, res) {
    try {
      const id_usuario = req.user.id;
      const { endereco } = req.body;

      // obter carrinho
      const carrinho = await CarrinhoModel.getOrCreateCarrinho(id_usuario);
      const itens = await CarrinhoModel.listarItens(carrinho.id);

      if (!itens.length) {
        return res.status(400).json({ sucesso:false, mensagem: "Carrinho vazio" });
      }

      // montar itens para pedido: usar id_produto, quantidade, preco_unitario
      const itensParaPedido = itens.map(i => ({
        id_produto: i.id_produto,
        quantidade: i.quantidade,
        preco_unitario: i.preco_unitario
      }));

      // criar pedido (transacional) e inserir itens
      const { id_pedido, numeroPedido } = await PedidoModel.criarPedidoComItens(id_usuario, endereco || null, itensParaPedido);

      // limpar carrinho
      await CarrinhoModel.limparCarrinho(carrinho.id);

      return res.status(201).json({ sucesso:true, id_pedido, numeroPedido });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ sucesso:false, mensagem: "Erro no checkout" });
    }
  }

  // GET /pedidos/:id
  static async verPedido(req, res) {
    try {
      const id_pedido = req.params.id;
      const pedido = await (await import("../models/PedidoModel.js")).default.buscarPorId(id_pedido);
      if (!pedido) return res.status(404).json({ sucesso:false, mensagem: "Pedido não encontrado" });
      return res.json({ sucesso:true, pedido });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ sucesso:false, mensagem: "Erro interno" });
    }
  }
}

export default PedidoController;
