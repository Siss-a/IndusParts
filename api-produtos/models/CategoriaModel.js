import db from '../config/database.js';

class CategoriaModel {
    
    static async criar(dados) {
        const { nome, descricao } = dados;
        const [result] = await db.query(
            "INSERT INTO categorias (nome, descricao) VALUES (?, ?)",
            [nome, descricao]
        );
        return result.insertId;
    }

    static async listar() {
        const [rows] = await db.query("SELECT * FROM categorias ORDER BY nome");
        return rows;
    }

    static async buscarPorId(id) {
        const [rows] = await db.query(
            "SELECT * FROM categorias WHERE id = ?",
            [id]
        );
        return rows[0];
    }

    static async buscarPorNome(nome) {
        const [rows] = await db.query(
            "SELECT * FROM categorias WHERE nome LIKE ?",
            [`%${nome}%`]
        );
        return rows;
    }

    static async atualizar(id, dados) {
        const { nome, descricao } = dados;
        await db.query(
            "UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?",
            [nome, descricao, id]
        );
    }

    static async excluir(id) {
        await db.query("DELETE FROM categorias WHERE id = ?", [id]);
    }
}

export default CategoriaModel;
