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
    static async criar(dados) {
        try {
            const db = await getConnection();
            const sql = `
            INSERT INTO produtos (nome, descricao, img, categoria, fornecedor, especificacoes, preco, estoque)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

            const values = [
                dados.nome,
                dados.descricao,
                dados.img,
                dados.categoria,
                dados.fornecedor,
                dados.especificacoes,
                dados.preco,
                dados.estoque
            ];

            const [result] = await db.query(sql, values);
            return result.insertId;
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            throw error;
        }
    }


    // Atualizar produto (UPDATE dinâmico - só campos enviados)
    static async atualizar(id, dados) {
        try {
            const db = await getConnection();

            // Construir SQL dinamicamente apenas com campos fornecidos
            const campos = [];
            const valores = [];

            if (dados.nome !== undefined) {
                campos.push('nome = ?');
                valores.push(dados.nome);
            }
            if (dados.descricao !== undefined) {
                campos.push('descricao = ?');
                valores.push(dados.descricao);
            }
            if (dados.img !== undefined) {
                campos.push('img = ?');
                valores.push(dados.img);
            }
            if (dados.categoria !== undefined) {
                campos.push('categoria = ?');
                valores.push(dados.categoria);
            }
            if (dados.fornecedor !== undefined) {
                campos.push('fornecedor = ?');
                valores.push(dados.fornecedor);
            }
            if (dados.especificacoes !== undefined) {
                campos.push('especificacoes = ?');
                valores.push(dados.especificacoes);
            }
            if (dados.preco !== undefined) {
                campos.push('preco = ?');
                valores.push(dados.preco);
            }
            if (dados.estoque !== undefined) {
                campos.push('estoque = ?');
                valores.push(dados.estoque);
            }
            

            // Se não há campos para atualizar, retorna true
            if (campos.length === 0) {
                return true;
            }

            valores.push(id);
            const sql = `UPDATE produtos SET ${campos.join(', ')} WHERE id = ?`;

            const [result] = await db.query(sql, valores);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            throw error;
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