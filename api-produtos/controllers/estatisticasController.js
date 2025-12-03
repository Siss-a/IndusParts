import ProdutoModel from "../models/ProdutoModel.js";
import UsuarioModel from "../models/UsuarioModel.js";
import PedidoModel from "../models/PedidoModel.js";

class estatisticasController {
  static async resumo(req, res) {
    try {
      const totalProdutos = await ProdutoModel.contarTodos();
      const totalCategorias = await ProdutoModel.contarCategorias();
      const totalUsuarios = await UsuarioModel.contarUsuarios();
      const totalPedidos = await PedidoModel.contarPedidos();
      const maisVendidos = await ProdutoModel.topVendidos(5);
      const estoqueBaixo = await ProdutoModel.estoqueAbaixo(10);

      return res.json({
        sucesso: true,
        dados: {
          totalProdutos,
          totalCategorias,
          totalUsuarios,
          totalPedidos,
          pedidosMes,
          faturamentoMes,
          maisVendidos,
          estoqueBaixo
        }
      });
    } catch (error) {
      console.error("Erro no dashboard:", error);
      res.status(500).json({ sucesso: false, erro: "Erro interno" });
    }
  }
}

export default estatisticasController;
