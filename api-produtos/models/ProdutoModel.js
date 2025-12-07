import { create, read, update, deleteRecord, getConnection } from '../config/database.js'

class ProdutoModel {
    // Listar todos os produtos com paginação
    static async listarTodos(limite, offset) {
        try {
            const db = await getConnection();

            // Buscar produtos
            const [produtos] = await db.query(
                'SELECT * FROM produtos ORDER BY id DESC LIMIT ? OFFSET ?',
                [limite, offset]
            );

            // Buscar total de registros
            const [total] = await db.query('SELECT COUNT(*) as total FROM produtos');

            return {
                produtos,
                total: total[0].total,
                totalPaginas: Math.ceil(total[0].total / limite)
            };
        } catch (error) {
            console.error('Erro ao listar produtos:', error);
            throw error;
        }
    }

    // Buscar produto por ID
    static async buscarPorId(id) {
        try {
            const db = await getConnection();
            const [rows] = await db.query(
                'SELECT * FROM produtos WHERE id = ?',
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Erro ao buscar produto por ID:', error);
            throw error;
        }
    }

    static async buscarPorCategoria(categoria) {
        try {
            return await read('produtos', `categoria = '${categoria}'`);
        } catch (error) {
            console.error('Erro ao buscar produtos por categoria:', error);
            throw error;
        }
    }

    // Criar novo produto
    static async criar(dadosProduto) {
        try {
            return await create('produtos', dadosProduto)
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            throw error;
        }
    }


    // Atualizar produto (UPDATE dinâmico - só campos enviados)
    static async atualizar(id, dados){
        try{
            return await update('produtos', dadosProduto, `id = ${id}`)
        } catch(err){
            console.error(`Erro ao atualizar produto:`, err)
            throw err
        }
    }

    // Excluir produto por ID
    static async excluir(id) {
        try {
            const db = await getConnection();
            const [result] = await db.query(
                'DELETE FROM produtos WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            throw error;
        }
    }

    // Buscar produtos ativos
    static async buscarAtivos(limite, offset) {
        try {
            const db = await getConnection();
            const [produtos] = await db.query(
                'SELECT * FROM produtos WHERE ativo = true ORDER BY id DESC LIMIT ? OFFSET ?',
                [limite, offset]
            );
            return produtos;
        } catch (error) {
            console.error('Erro ao buscar produtos ativos:', error);
            throw error;
        }
    }
}

export default ProdutoModel;