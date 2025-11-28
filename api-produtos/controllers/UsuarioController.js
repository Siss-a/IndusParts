import UsuarioModel from '../models/UsuarioModel.js';

class UsuarioController {
    // POST /usuarios - Criar novo usuário (apenas admin)
    static async criarUsuario(req, res) {
        try {
            const { nome_social, email, senha, tipo, telefone, cnpj } = req.body;

            // Validações básicas
            if (!nome_social || nome_social.trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome obrigatório',
                    mensagem: 'O nome é obrigatório'
                });
            }

            if (!email || email.trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Email obrigatório',
                    mensagem: 'O email é obrigatório'
                });
            }

            if (!senha || senha.trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Senha obrigatória',
                    mensagem: 'A senha é obrigatória'
                });
            }

            if (!cnpj || cnpj.trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'CNPJ obrigatório',
                    mensagem: 'O CNPJ é obrigatório'
                });
            }

            // Validações de formato
            if (nome_social.length < 2) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome muito curto',
                    mensagem: 'O nome deve ter pelo menos 2 caracteres'
                });
            }

            if (nome_social.length > 255) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome muito longo',
                    mensagem: 'O nome deve ter no máximo 255 caracteres'
                });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Email inválido',
                    mensagem: 'Formato de email inválido'
                });
            }

            if (senha.length < 6) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Senha muito curta',
                    mensagem: 'A senha deve ter pelo menos 6 caracteres'
                });
            }

            // Verificar se o email já existe
            const usuarioExistente = await UsuarioModel.buscarPorEmail(email);
            if (usuarioExistente) {
                return res.status(409).json({
                    sucesso: false,
                    erro: 'Email já cadastrado',
                    mensagem: 'Este email já está sendo usado por outro usuário'
                });
            }

            // Preparar dados do usuário
            const dadosUsuario = {
                nome_social: nome_social.trim(),
                email: email.trim().toLowerCase(),
                senha: senha,
                telefone: telefone,
                cnpj: cnpj,
                tipo: tipo || 'comum'
            };

            // Criar usuário
            const usuarioId = await UsuarioModel.criar(dadosUsuario);

            res.status(201).json({
                sucesso: true,
                mensagem: 'Usuário criado com sucesso',
                dados: {
                    id: usuarioId,
                    nome_social: dadosUsuario.nome_social,
                    email: dadosUsuario.email,
                    telefone: dadosUsuario.telefone,
                    cnpj: dadosUsuario.cnpj,
                    tipo: dadosUsuario.tipo
                }
            });
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível criar o usuário'
            });
        }
    }

    // PUT /usuarios/:id - Atualizar usuário (apenas admin)
    static async atualizarUsuario(req, res) {
        try {
            const { id } = req.params;
            const { nome_social, email, senha, tipo } = req.body;

            // Validação do ID
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                });
            }

            // Verificar se o usuário existe
            const usuarioExistente = await UsuarioModel.buscarPorId(id);
            if (!usuarioExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado',
                    mensagem: `Usuário com ID ${id} não foi encontrado`
                });
            }

            // Preparar dados para atualização
            const dadosAtualizacao = {};

            if (nome_social !== undefined) {
                if (nome_social.trim() === '') {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Nome inválido',
                        mensagem: 'O nome não pode estar vazio'
                    });
                }
                if (nome_social.length < 2) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Nome muito curto',
                        mensagem: 'O nome deve ter pelo menos 2 caracteres'
                    });
                }
                dadosAtualizacao.nome_social = nome_social.trim();
            }

            if (email !== undefined) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Email inválido',
                        mensagem: 'Formato de email inválido'
                    });
                }

                // Verificar se o email já está em uso por outro usuário
                const usuarioComEmail = await UsuarioModel.buscarPorEmail(email);
                if (usuarioComEmail && usuarioComEmail.id !== parseInt(id)) {
                    return res.status(409).json({
                        sucesso: false,
                        erro: 'Email já cadastrado',
                        mensagem: 'Este email já está sendo usado por outro usuário'
                    });
                }

                dadosAtualizacao.email = email.trim().toLowerCase();
            }

            if (senha !== undefined) {
                if (senha.length < 6) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Senha muito curta',
                        mensagem: 'A senha deve ter pelo menos 6 caracteres'
                    });
                }
                dadosAtualizacao.senha = senha;
            }

            if (tipo !== undefined) {
                dadosAtualizacao.tipo = tipo;
            }

            // Verificar se há dados para atualizar
            if (Object.keys(dadosAtualizacao).length === 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nenhum dado para atualizar',
                    mensagem: 'Forneça pelo menos um campo para atualizar'
                });
            }

            // Atualizar usuário
            const resultado = await UsuarioModel.atualizar(id, dadosAtualizacao);

            res.status(200).json({
                sucesso: true,
                mensagem: 'Usuário atualizado com sucesso',
                dados: {
                    linhasAfetadas: resultado || 1
                }
            });
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível atualizar o usuário'
            });
        }
    }

    // DELETE /usuarios/:id - Excluir usuário (apenas admin)
    static async excluirUsuario(req, res) {
        try {
            const { id } = req.params;

            // Validação do ID
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                });
            }

            // Verificar se o usuário existe
            const usuarioExistente = await UsuarioModel.buscarPorId(id);
            if (!usuarioExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado',
                    mensagem: `Usuário com ID ${id} não foi encontrado`
                });
            }

            // Excluir usuário
            const resultado = await UsuarioModel.excluir(id);

            res.status(200).json({
                sucesso: true,
                mensagem: 'Usuário excluído com sucesso',
                dados: {
                    linhasAfetadas: resultado || 1
                }
            });
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível excluir o usuário'
            });
        }
    }
    // GET /auth/perfil - Obter perfil do usuário logado
    static async obterPerfil(req, res) {
        try {
            const usuario = await UsuarioModel.buscarPorId(req.usuario.id);

            if (!usuario) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado',
                    mensagem: 'Usuário não foi encontrado'
                });
            }

            // Remover senha dos dados retornados
            const { senha, ...usuarioSemSenha } = usuario;

            res.status(200).json({
                sucesso: true,
                dados: usuarioSemSenha
            });
        } catch (error) {
            console.error('Erro ao obter perfil:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível obter o perfil'
            });
        }
    }

    // GET /usuarios - Listar todos os usuários (apenas admin, com paginação)
    static async listarUsuarios(req, res) {
        try {
            // Obter parâmetros de paginação da query string
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = parseInt(req.query.limite) || 10;

            // Validações
            if (pagina < 1) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Página inválida',
                    mensagem: 'A página deve ser um número maior que zero'
                });
            }

            const limiteMaximo = parseInt(process.env.PAGINACAO_LIMITE_MAXIMO) || 100;
            if (limite < 1 || limite > limiteMaximo) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Limite inválido',
                    mensagem: `O limite deve ser um número entre 1 e ${limiteMaximo}`
                });
            }

            const resultado = await UsuarioModel.listarTodos(pagina, limite);

            // Remover senha de todos os usuários
            const usuariosSemSenha = resultado.usuarios.map(({ senha, ...usuario }) => usuario);

            res.status(200).json({
                sucesso: true,
                dados: usuariosSemSenha,
                paginacao: {
                    pagina: resultado.pagina,
                    limite: resultado.limite,
                    total: resultado.total,
                    totalPaginas: resultado.totalPaginas
                }
            });
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível listar os usuários'
            });
        }
    }

}

export default UsuarioController