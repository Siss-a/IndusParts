import CompanyModel from '../models/CompanyModel.js';

// Controller para operações com empresas
class CompanyController {

    // GET /companies - Listar todas as empresas (com paginação)
    static async listarTodos(req, res) {
        try {
            let pagina = parseInt(req.query.pagina) || 1;
            let limite = parseInt(req.query.limite) || 10;

            if (pagina <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Página inválida',
                    mensagem: 'A página deve ser um número maior que zero'
                });
            }

            const limiteMaximo = parseInt(process.env.PAGINACAO_LIMITE_MAXIMO) || 100;
            if (limite <= 0 || limite > limiteMaximo) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Limite inválido',
                    mensagem: `O limite deve ser um número entre 1 e ${limiteMaximo}`
                });
            }

            const offset = (pagina - 1) * limite;
            const resultado = await CompanyModel.listarTodos(limite, offset);

            res.status(200).json({
                sucesso: true,
                dados: resultado.companies,
                paginacao: {
                    pagina: resultado.pagina,
                    limite: resultado.limite,
                    total: resultado.total,
                    totalPaginas: resultado.totalPaginas
                }
            });
        } catch (error) {
            console.error('Erro ao listar empresas:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível listar as empresas'
            });
        }
    }

    // GET /companies/:id - Buscar empresa por ID
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                });
            }

            const company = await CompanyModel.buscarPorId(id);

            if (!company) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Empresa não encontrada',
                    mensagem: `Empresa com ID ${id} não foi encontrada`
                });
            }

            res.status(200).json({
                sucesso: true,
                dados: company
            });
        } catch (error) {
            console.error('Erro ao buscar empresa:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível buscar a empresa'
            });
        }
    }

    // POST /companies - Criar nova empresa
    static async criar(req, res) {
        try {
            const { cnpj, corporate_name, email, phone } = req.body;

            // Validações
            const erros = [];

            if (!cnpj || cnpj.trim() === '') {
                erros.push({
                    campo: 'cnpj',
                    mensagem: 'CNPJ é obrigatório'
                });
            } else {
                // Remover caracteres não numéricos
                const cnpjLimpo = cnpj.replace(/\D/g, '');
                
                if (cnpjLimpo.length !== 14) {
                    erros.push({
                        campo: 'cnpj',
                        mensagem: 'CNPJ deve ter 14 dígitos'
                    });
                }

                // Verificar se CNPJ já existe
                const cnpjExistente = await CompanyModel.buscarPorCnpj(cnpjLimpo);
                if (cnpjExistente) {
                    erros.push({
                        campo: 'cnpj',
                        mensagem: 'Este CNPJ já está cadastrado'
                    });
                }
            }

            if (!corporate_name || corporate_name.trim() === '') {
                erros.push({
                    campo: 'corporate_name',
                    mensagem: 'Razão social é obrigatória'
                });
            } else if (corporate_name.trim().length < 3) {
                erros.push({
                    campo: 'corporate_name',
                    mensagem: 'Razão social deve ter pelo menos 3 caracteres'
                });
            }

            if (email && email.trim() !== '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    erros.push({
                        campo: 'email',
                        mensagem: 'Formato de e-mail inválido'
                    });
                }
            }

            if (erros.length > 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Dados inválidos',
                    detalhes: erros
                });
            }

            // Preparar dados
            const dadosEmpresa = {
                cnpj: cnpj.replace(/\D/g, ''),
                corporate_name: corporate_name.trim(),
                email: email ? email.trim() : null,
                phone: phone ? phone.trim() : null
            };

            const companyId = await CompanyModel.criar(dadosEmpresa);

            res.status(201).json({
                sucesso: true,
                mensagem: 'Empresa criada com sucesso',
                dados: {
                    id: companyId,
                    ...dadosEmpresa
                }
            });
        } catch (error) {
            console.error('Erro ao criar empresa:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível criar a empresa'
            });
        }
    }

    // PUT /companies/:id - Atualizar empresa
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { cnpj, corporate_name, email, phone } = req.body;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                });
            }

            // Verificar se empresa existe
            const empresaExistente = await CompanyModel.buscarPorId(id);
            if (!empresaExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Empresa não encontrada',
                    mensagem: `Empresa com ID ${id} não foi encontrada`
                });
            }

            const dadosAtualizacao = {};

            if (cnpj !== undefined) {
                const cnpjLimpo = cnpj.replace(/\D/g, '');
                
                if (cnpjLimpo.length !== 14) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'CNPJ inválido',
                        mensagem: 'CNPJ deve ter 14 dígitos'
                    });
                }

                // Verificar se CNPJ já existe em outra empresa
                const cnpjExistente = await CompanyModel.buscarPorCnpj(cnpjLimpo);
                if (cnpjExistente && cnpjExistente.id !== parseInt(id)) {
                    return res.status(409).json({
                        sucesso: false,
                        erro: 'CNPJ já cadastrado',
                        mensagem: 'Este CNPJ já está sendo usado por outra empresa'
                    });
                }

                dadosAtualizacao.cnpj = cnpjLimpo;
            }

            if (corporate_name !== undefined) {
                if (corporate_name.trim() === '') {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Razão social inválida',
                        mensagem: 'A razão social não pode estar vazia'
                    });
                }
                dadosAtualizacao.corporate_name = corporate_name.trim();
            }

            if (email !== undefined) {
                if (email.trim() !== '') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                        return res.status(400).json({
                            sucesso: false,
                            erro: 'E-mail inválido',
                            mensagem: 'Formato de e-mail inválido'
                        });
                    }
                }
                dadosAtualizacao.email = email ? email.trim() : null;
            }

            if (phone !== undefined) {
                dadosAtualizacao.phone = phone ? phone.trim() : null;
            }

            if (Object.keys(dadosAtualizacao).length === 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nenhum dado para atualizar',
                    mensagem: 'Forneça pelo menos um campo para atualizar'
                });
            }

            const resultado = await CompanyModel.atualizar(id, dadosAtualizacao);

            res.status(200).json({
                sucesso: true,
                mensagem: 'Empresa atualizada com sucesso',
                dados: {
                    linhasAfetadas: resultado || 1
                }
            });
        } catch (error) {
            console.error('Erro ao atualizar empresa:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível atualizar a empresa'
            });
        }
    }

    // DELETE /companies/:id - Excluir empresa
    static async excluir(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                });
            }

            // Verificar se empresa existe
            const empresaExistente = await CompanyModel.buscarPorId(id);
            if (!empresaExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Empresa não encontrada',
                    mensagem: `Empresa com ID ${id} não foi encontrada`
                });
            }

            const resultado = await CompanyModel.excluir(id);

            res.status(200).json({
                sucesso: true,
                mensagem: 'Empresa excluída com sucesso',
                dados: {
                    linhasAfetadas: resultado || 1
                }
            });
        } catch (error) {
            console.error('Erro ao excluir empresa:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível excluir a empresa'
            });
        }
    }

    // GET /companies/:id/users - Buscar usuários da empresa
    static async buscarUsuarios(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                });
            }

            const users = await CompanyModel.buscarUsuarios(id);

            res.status(200).json({
                sucesso: true,
                dados: users
            });
        } catch (error) {
            console.error('Erro ao buscar usuários da empresa:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível buscar os usuários'
            });
        }
    }

    // GET /companies/:id/addresses - Buscar endereços da empresa
    static async buscarEnderecos(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                });
            }

            const addresses = await CompanyModel.buscarEnderecos(id);

            res.status(200).json({
                sucesso: true,
                dados: addresses
            });
        } catch (error) {
            console.error('Erro ao buscar endereços da empresa:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível buscar os endereços'
            });
        }
    }
}

export default CompanyController;