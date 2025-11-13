import { create, read, update, deleteRecord, comparePassword, hashPassword, getConnection } from '../config/database.js';

// Model para operações com usuários (tabela: users)
class UsuarioModel {
    // Listar todos os usuários (com paginação)
    static async listarTodos(pagina = 1, limite = 10) {
        try {
            const offset = (pagina - 1) * limite;
            
            const connection = await getConnection();
            try {
                // Query com JOIN para pegar o nome da empresa
                const sql = `
                    SELECT 
                        u.id,
                        u.company_id,
                        c.corporate_name as company_name,
                        u.name,
                        u.email,
                        u.role,
                        u.created_at
                    FROM users u
                    LEFT JOIN companies c ON u.company_id = c.id
                    ORDER BY u.id DESC 
                    LIMIT ? OFFSET ?
                `;
                const [users] = await connection.query(sql, [limite, offset]);
                
                const [totalResult] = await connection.execute('SELECT COUNT(*) as total FROM users');
                const total = totalResult[0].total;
                
                return {
                    users,
                    total,
                    pagina,
                    limite,
                    totalPaginas: Math.ceil(total / limite)
                };
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            throw error;
        }
    }

    // Buscar usuário por ID
    static async buscarPorId(id) {
        try {
            const connection = await getConnection();
            try {
                const sql = `
                    SELECT 
                        u.id,
                        u.company_id,
                        c.corporate_name as company_name,
                        u.name,
                        u.email,
                        u.password_hash,
                        u.role,
                        u.created_at
                    FROM users u
                    LEFT JOIN companies c ON u.company_id = c.id
                    WHERE u.id = ?
                `;
                const [rows] = await connection.query(sql, [id]);
                return rows[0] || null;
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Erro ao buscar usuário por ID:', error);
            throw error;
        }
    }

    // Buscar usuário por email
    static async buscarPorEmail(email) {
        try {
            const connection = await getConnection();
            try {
                const sql = `
                    SELECT 
                        u.id,
                        u.company_id,
                        c.corporate_name as company_name,
                        u.name,
                        u.email,
                        u.password_hash,
                        u.role,
                        u.created_at
                    FROM users u
                    LEFT JOIN companies c ON u.company_id = c.id
                    WHERE u.email = ?
                `;
                const [rows] = await connection.query(sql, [email]);
                return rows[0] || null;
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Erro ao buscar usuário por email:', error);
            throw error;
        }
    }

    // Criar novo usuário
    static async criar(dadosUsuario) {
        try {
            // Hash da senha antes de salvar
            const senhaHash = await hashPassword(dadosUsuario.password || dadosUsuario.senha);
            
            const dadosComHash = {
                company_id: dadosUsuario.company_id || null,
                name: dadosUsuario.name || dadosUsuario.nome,
                email: dadosUsuario.email,
                password_hash: senhaHash,
                role: dadosUsuario.role || dadosUsuario.tipo || 'company_user'
            };
            
            return await create('users', dadosComHash);
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw error;
        }
    }

    // Atualizar usuário
    static async atualizar(id, dadosUsuario) {
        try {
            const dadosAtualizacao = { ...dadosUsuario };
            
            // Se a senha foi fornecida, fazer hash
            if (dadosUsuario.password || dadosUsuario.senha) {
                dadosAtualizacao.password_hash = await hashPassword(
                    dadosUsuario.password || dadosUsuario.senha
                );
                delete dadosAtualizacao.password;
                delete dadosAtualizacao.senha;
            }
            
            // Mapear campos se necessário
            if (dadosUsuario.nome) {
                dadosAtualizacao.name = dadosUsuario.nome;
                delete dadosAtualizacao.nome;
            }
            
            if (dadosUsuario.tipo) {
                dadosAtualizacao.role = dadosUsuario.tipo;
                delete dadosAtualizacao.tipo;
            }
            
            return await update('users', dadosAtualizacao, `id = ${id}`);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw error;
        }
    }

    // Excluir usuário
    static async excluir(id) {
        try {
            return await deleteRecord('users', `id = ${id}`);
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            throw error;
        }
    }

    // Verificar credenciais de login
    static async verificarCredenciais(email, senha) {
        try {
            const usuario = await this.buscarPorEmail(email);
            
            if (!usuario) {
                return null;
            }

            const senhaValida = await comparePassword(senha, usuario.password_hash);
            
            if (!senhaValida) {
                return null;
            }

            // Retornar usuário sem a senha
            const { password_hash, ...usuarioSemSenha } = usuario;
            return usuarioSemSenha;
        } catch (error) {
            console.error('Erro ao verificar credenciais:', error);
            throw error;
        }
    }
}

export default UsuarioModel;