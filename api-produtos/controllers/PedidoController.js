// controllers/PedidoController.js
import CarrinhoModel from "../models/CarrinhoModel.js";
import PedidoModel from "../models/PedidoModel.js";

class PedidoController {
  // POST /pedidos/checkout -> { endereco }
  static async checkout(req, res) {
    try {
      const id_usuario = req.usuario.id;
      const { endereco } = req.body;

      // Validar endereço
      if (!endereco || endereco.trim() === "") {
        return res.status(400).json({ 
          sucesso: false, 
          mensagem: "Endereço de entrega é obrigatório" 
        });
      }

      // Obter itens do carrinho do usuário
      const itens = await CarrinhoModel.listarPorUsuario(id_usuario);

      if (!itens || itens.length === 0) {
        return res.status(400).json({ 
          sucesso: false, 
          mensagem: "Carrinho vazio" 
        });
      }

      // Montar itens para pedido usando os dados retornados do model
      const itensParaPedido = itens.map(item => ({
        id_produto: item.produto_id,
        quantidade: item.quantidade,
        preco_unitario: item.preco // preco vem do JOIN com produtos
      }));

      // Criar pedido (transacional) e inserir itens
      const { id_pedido, numeroPedido } = await PedidoModel.criarPedidoComItens(
        id_usuario, 
        endereco, 
        itensParaPedido
      );

      // Limpar carrinho após pedido criado com sucesso
      await CarrinhoModel.limpar(id_usuario);

      return res.status(201).json({ 
        sucesso: true, 
        id_pedido, 
        numeroPedido,
        mensagem: "Pedido realizado com sucesso!"
      });

    } catch (err) {
      console.error("Erro no checkout:", err);
      return res.status(500).json({ 
        sucesso: false, 
        mensagem: "Erro ao processar pedido. Tente novamente." 
      });
    }
  }

  // GET /pedidos/:id
  static async verPedido(req, res) {
    try {
      const id_pedido = parseInt(req.params.id);
      const id_usuario = req.usuario.id;

      // Validar ID do pedido
      if (!id_pedido || isNaN(id_pedido)) {
        return res.status(400).json({ 
          sucesso: false, 
          mensagem: "ID do pedido inválido" 
        });
      }

      // Buscar pedido
      const pedido = await PedidoModel.buscarPorId(id_pedido);

      if (!pedido) {
        return res.status(404).json({ 
          sucesso: false, 
          mensagem: "Pedido não encontrado" 
        });
      }

      // Verificar se o pedido pertence ao usuário logado
      if (pedido.id_cliente_empresa !== id_usuario) {
        return res.status(403).json({ 
          sucesso: false, 
          mensagem: "Você não tem permissão para ver este pedido" 
        });
      }

      return res.json({ 
        sucesso: true, 
        pedido 
      });

    } catch (err) {
      console.error("Erro ao buscar pedido:", err);
      return res.status(500).json({ 
        sucesso: false, 
        mensagem: "Erro ao buscar pedido" 
      });
    }
  }

  // GET /pedidos - Listar pedidos do usuário
  static async listarPedidos(req, res) {
    try {
      const id_usuario = req.user.id;

      const pedidos = await PedidoModel.listarPorUsuario(id_usuario);

      return res.json({ 
        sucesso: true, 
        pedidos 
      });

    } catch (err) {
      console.error("Erro ao listar pedidos:", err);
      return res.status(500).json({ 
        sucesso: false, 
        mensagem: "Erro ao listar pedidos" 
      });
    }
  }
}

export default PedidoController;