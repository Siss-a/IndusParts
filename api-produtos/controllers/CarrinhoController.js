// controllers/CarrinhoController.js
import CarrinhoModel from "../models/CarrinhoModel.js";

class CarrinhoController {
  // GET /carrinho => retorna itens do carrinho do usuário logado
  static async verCarrinho(req, res) {
    try {
      const id_usuario = req.user.id;
      const carrinho = await CarrinhoModel.getOrCreateCarrinho(id_usuario);
      const itens = await CarrinhoModel.listarItens(carrinho.id);
      const total = await CarrinhoModel.calcularTotal(carrinho.id);

      return res.json({
        sucesso: true,
        carrinho: { id: carrinho.id, itens, total }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  // POST /carrinho/item -> { id_produto, quantidade }
  static async adicionarItem(req, res) {
    try {
      const id_usuario = req.user.id;
      const { id_produto, quantidade = 1 } = req.body;

      //verifica se o campo existe e se é um número válido.
      if (!id_produto || isNaN(id_produto)) {
        return res.status(400).json({ sucesso:false, mensagem: "id_produto inválido" });
      }
      //impede que a quantidade seja zero ou negativa
      if (quantidade <= 0) {
        return res.status(400).json({ sucesso:false, mensagem: "quantidade inválida" });
      }

      // obter preço do produto para gravar preço_unitario (garantir consistência)
      const connection = await (await import("../config/database.js")).getConnection();
      try {
        const [prodRows] = await connection.execute(
          "SELECT id, nome, img, preco FROM produtos WHERE id = ?",
          [id_produto]
        );
        if (!prodRows.length) {
          return res.status(404).json({ sucesso:false, mensagem: "Produto não encontrado" });
        }
        const produto = prodRows[0];

        const carrinho = await CarrinhoModel.getOrCreateCarrinho(id_usuario);

        await CarrinhoModel.adicionarItem(carrinho.id, id_produto, parseInt(quantidade), parseFloat(produto.preco));

        return res.json({ sucesso: true, mensagem: "Item adicionado" });
      } finally {
        connection.release();
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ sucesso:false, mensagem: "Erro interno" });
    }
  }

  // PUT /carrinho/item/:id_item -> { quantidade }
  static async atualizarQuantidade(req, res) {
    try {
      const id_item = req.params.id_item;
      const { quantidade } = req.body;
      if (isNaN(quantidade)) {
        return res.status(400).json({ sucesso:false, mensagem: "Quantidade inválida" });
      }
      const affected = await CarrinhoModel.atualizarQuantidade(id_item, parseInt(quantidade));
      return res.json({ sucesso:true, affectedRows: affected });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ sucesso:false, mensagem: "Erro interno" });
    }
  }

  // DELETE /carrinho/item/:id_item
  static async removerItem(req, res) {
    try {
      const id_item = req.params.id_item;
      const affected = await CarrinhoModel.removerItem(id_item);
      return res.json({ sucesso:true, affectedRows: affected });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ sucesso:false, mensagem: "Erro interno" });
    }
  }

  // DELETE /carrinho  -> limpa carrinho do usuário
  static async limparCarrinho(req, res) {
    try {
      const id_usuario = req.user.id;
      const carrinho = await CarrinhoModel.getOrCreateCarrinho(id_usuario);
      const affected = await CarrinhoModel.limparCarrinho(carrinho.id);
      return res.json({ sucesso:true, affectedRows: affected });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ sucesso:false, mensagem: "Erro interno" });
    }
  }
}

export default CarrinhoController;