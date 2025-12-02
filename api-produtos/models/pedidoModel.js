import { create, read, update, deleteRecord, getConnection } from '../config/database.js';

class PedidoModel {

    // Criar pedido completo
    static async criarPedido(usuarioId, total, status = "pendente") {
        try {
            return await create('pedidos', {
                usuario_id: usuarioId,
                total,
                status,
                data_criacao: new Date()
            });

        } catch (error) {
            console.error("Erro ao criar pedido:", error);
            throw error;
        }
    }

    // Adicionar item ao pedido
    static async adicionarItem(pedidoId, produtoId, quantidade, precoUnitario) {
        try {
            const subtotal = quantidade * precoUnitario;

            return await create('pedidos_itens', {
                pedido_id: pedidoId,
                produto_id: produtoId,
                quantidade,
                preco_unitario: precoUnitario,
                subtotal
            });

        } catch (error) {
            console.error("Erro ao adicionar item ao pedido:", error);
            throw error;
        }
    }

    // Buscar pedido + itens pelo ID
    static async buscarPorId(pedidoId) {
        try {
            const conn = await getConnection();

            // Pedido
            const [pedidoRows] = await conn.query(
                "SELECT * FROM pedidos WHERE id = ?",
                [pedidoId]
            );

            if (pedidoRows.length === 0) return null;

            const pedido = pedidoRows[0];

            // Itens
            const [itensRows] = await conn.query(
                `SELECT i.*, p.nome, p.descricao, p.imagem
                   FROM pedidos_itens i
                   JOIN produtos p ON i.produto_id = p.id
                  WHERE i.pedido_id = ?`,
                [pedidoId]
            );

            return {
                ...pedido,
                itens: itensRows
            };

        } catch (error) {
            console.error("Erro ao buscar pedido:", error);
            throw error;
        }
    }

    // Listar pedidos do usuário
    static async listarPorUsuario(usuarioId) {
        try {
            const conn = await getConnection();

            const [rows] = await conn.query(
                "SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY data_criacao DESC",
                [usuarioId]
            );

            return rows;

        } catch (error) {
            console.error("Erro ao listar pedidos:", error);
            throw error;
        }
    }

    // Atualizar status (ex: pago, enviado, cancelado...)
    static async atualizarStatus(pedidoId, status) {
        try {
            return await update(
                'pedidos',
                { status },
                `id = ${pedidoId}`
            );

        } catch (error) {
            console.error("Erro ao atualizar status do pedido:", error);
            throw error;
        }
    }
}

export default PedidoModel;
