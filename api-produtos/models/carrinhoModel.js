import { create, read, update, deleteRecord, getConnection } from '../config/database.js';

class CarrinhoModel {

    // Listar itens do carrinho de um usuário
    static async listarPorUsuario(usuarioId) {
        try {
            const conn = await getConnection();

            const [rows] = await conn.query(
                `SELECT c.id, c.usuario_id, c.produto_id, c.quantidade,
                        p.nome, p.preco, p.imagem
                   FROM carrinho c
                   JOIN produtos p ON c.produto_id = p.id
                  WHERE c.usuario_id = ?`,
                [usuarioId]
            );

            return rows;

        } catch (error) {
            console.error("Erro ao listar carrinho:", error);
            throw error;
        }
    }

    // Buscar um item específico no carrinho
    static async buscarItem(usuarioId, produtoId) {
        try {
            const rows = await read(
                'carrinho',
                `usuario_id = ${usuarioId} AND produto_id = ${produtoId}`
            );

            return rows[0] || null;

        } catch (error) {
            console.error("Erro ao buscar item do carrinho:", error);
            throw error;
        }
    }

    // Adicionar item (ou aumentar quantidade)
    static async adicionar(usuarioId, produtoId, quantidade) {
        try {
            return await create('carrinho', {
                usuario_id: usuarioId,
                produto_id: produtoId,
                quantidade
            });

        } catch (error) {
            console.error("Erro ao adicionar item ao carrinho:", error);
            throw error;
        }
    }

    // Atualizar quantidade
    static async atualizarQuantidade(usuarioId, produtoId, quantidade) {
        try {
            return await update(
                'carrinho',
                { quantidade },
                `usuario_id = ${usuarioId} AND produto_id = ${produtoId}`
            );

        } catch (error) {
            console.error("Erro ao atualizar o carrinho:", error);
            throw error;
        }
    }

    // Remover item
    static async remover(usuarioId, produtoId) {
        try {
            return await deleteRecord(
                'carrinho',
                `usuario_id = ${usuarioId} AND produto_id = ${produtoId}`
            );

        } catch (error) {
            console.error("Erro ao remover item do carrinho:", error);
            throw error;
        }
    }

    // Esvaziar carrinho após pedido
    static async limpar(usuarioId) {
        try {
            return await deleteRecord('carrinho', `usuario_id = ${usuarioId}`);

        } catch (error) {
            console.error("Erro ao limpar carrinho:", error);
            throw error;
        }
    }
}

export default CarrinhoModel;