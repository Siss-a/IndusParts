import { create, read, update, deleteRecord, getConnection } from '../config/database.js';

// Model para operações com empresas (companies)
class CompanyModel {
    // Listar todas as empresas (com paginação)
    static async listarTodos(limite = 10, offset = 0) {
        try {
            const connection = await getConnection();
            try {
                const sql = 'SELECT * FROM companies ORDER BY id DESC LIMIT ? OFFSET ?';
                const [companies] = await connection.query(sql, [limite, offset]);
                
                const [totalResult] = await connection.execute('SELECT COUNT(*) as total FROM companies');
                const total = totalResult[0].total;
                
                const paginaAtual = (offset / limite) + 1;
                const totalPaginas = Math.ceil(total / limite);
                
                return {
                    companies,
                    total,
                    pagina: paginaAtual,
                    limite,
                    totalPaginas
                };
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Erro ao listar empresas:', error);
            throw error;
        }
    }

    // Buscar empresa por ID
    static async buscarPorId(id) {
        try {
            const rows = await read('companies', `id = ${id}`);
            return rows[0] || null;
        } catch (error) {
            console.error('Erro ao buscar empresa por ID:', error);
            throw error;
        }
    }

    // Buscar empresa por CNPJ
    static async buscarPorCnpj(cnpj) {
        try {
            const rows = await read('companies', `cnpj = '${cnpj}'`);
            return rows[0] || null;
        } catch (error) {
            console.error('Erro ao buscar empresa por CNPJ:', error);
            throw error;
        }
    }

    // Criar nova empresa
    static async criar(dadosEmpresa) {
        try {
            return await create('companies', dadosEmpresa);
        } catch (error) {
            console.error('Erro ao criar empresa:', error);
            throw error;
        }
    }

    // Atualizar empresa
    static async atualizar(id, dadosEmpresa) {
        try {
            return await update('companies', dadosEmpresa, `id = ${id}`);
        } catch (error) {
            console.error('Erro ao atualizar empresa:', error);
            throw error;
        }
    }

    // Excluir empresa
    static async excluir(id) {
        try {
            return await deleteRecord('companies', `id = ${id}`);
        } catch (error) {
            console.error('Erro ao excluir empresa:', error);
            throw error;
        }
    }

    // Buscar usuários de uma empresa
    static async buscarUsuarios(companyId) {
        try {
            const connection = await getConnection();
            try {
                const sql = `
                    SELECT id, name, email, role, created_at 
                    FROM users 
                    WHERE company_id = ?
                    ORDER BY id DESC
                `;
                const [users] = await connection.query(sql, [companyId]);
                return users;
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Erro ao buscar usuários da empresa:', error);
            throw error;
        }
    }

    // Buscar endereços de uma empresa
    static async buscarEnderecos(companyId) {
        try {
            return await read('addresses', `company_id = ${companyId}`);
        } catch (error) {
            console.error('Erro ao buscar endereços da empresa:', error);
            throw error;
        }
    }
}

export default CompanyModel;