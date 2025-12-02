import { create, read, update, deleteRecord, comparePassword, hashPassword, getConnection } from '../config/database.js';

class UsuarioModel {

    static async listarTodos(pagina = 1, limite = 10) {
        try {
            const offset = (pagina - 1) * limite;

            const conn = await getConnection();
            const [rows] = await conn.query(
                "SELECT SQL_CALC_FOUND_ROWS * FROM usuarios LIMIT ? OFFSET ?",
                [limite, offset]
            );

            const [[{ 'FOUND_ROWS()': total }]] = await conn.query("SELECT FOUND_ROWS()");

            const usuariosSemSenha = rows.map(({ senha_hash, ...usuario }) => usuario);

            return {
                usuarios: usuariosSemSenha,
                pagina,
                limite,
                total,
                totalPaginas: Math.ceil(total / limite)
            };
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            throw error;
        }
    }

    static async buscarPorId(id) {
        try {
            const conn = await getConnection();
            const [rows] = await conn.query(
                "SELECT * FROM usuarios WHERE id = ?",
                [id]
            );
            conn.release();
            return rows[0] || null;
        } catch (error) {
            console.error('Erro ao buscar usuário por ID:', error);
            throw error;
        }
    }

    static async buscarPorEmail(email) {
        try {
            const conn = await getConnection();
            const [rows] = await conn.query(
                "SELECT * FROM usuarios WHERE email = ?",
                [email]
            );
            conn.release();
            return rows[0] || null;
        } catch (error) {
            console.error('Erro ao buscar usuário por email:', error);
            throw error;
        }
    }

    static async buscarPorCNPJ(cnpj) {
        try {
            const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
            const conn = await getConnection();
            const [rows] = await conn.query(
                "SELECT * FROM usuarios WHERE cnpj = ?",
                [cnpjLimpo]
            );
            conn.release();
            return rows[0] || null;
        }
        catch (error) {
            console.error('Erro ao buscar usuário por CNPJ:', error);
            throw error;
        }
    }

    static async criar(dadosUsuario) {
        try {
            const senhaHash = await hashPassword(dadosUsuario.senha);

            const dadosComHash = {
                nome_social: dadosUsuario.nome_social,
                email: dadosUsuario.email,
                cnpj: dadosUsuario.cnpj,
                telefone: dadosUsuario.telefone,
                senha_hash: senhaHash
            };

            return await create('usuarios', dadosComHash);
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw error;
        }
    }

    static async atualizar(id, dadosUsuario) {
        try {
            if (dadosUsuario.senha) {
                dadosUsuario.senha_hash = await hashPassword(dadosUsuario.senha);
                delete dadosUsuario.senha;
            }

            const conn = await getConnection();
            const set = Object.keys(dadosUsuario)
                .map(column => `${column} = ?`)
                .join(', ');

            const sql = `UPDATE usuarios SET ${set} WHERE id = ?`;
            const values = [...Object.values(dadosUsuario), id];

            const [result] = await conn.execute(sql, values);
            conn.release();
            return result.affectedRows;
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw error;
        }
    }

    static async excluir(id) {
        try {
            const conn = await getConnection();
            const [result] = await conn.execute(
                "DELETE FROM usuarios WHERE id = ?",
                [id]
            );
            conn.release();
            return result.affectedRows;
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            throw error;
        }
    }

    static async verificarCredenciais(email, senha) {
        try {
            const usuario = await this.buscarPorEmail(email);

            if (!usuario) {
                return null;
            }

            const senhaValida = await comparePassword(senha, usuario.senha_hash);

            if (!senhaValida) {
                return null;
            }

            const { senha_hash: _, ...usuarioSemSenha } = usuario;
            return usuarioSemSenha;
        } catch (error) {
            console.error('Erro ao verificar credenciais:', error);
            throw error;
        }
    }
}

export default UsuarioModel;