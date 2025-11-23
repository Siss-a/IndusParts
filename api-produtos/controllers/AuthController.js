import jwt from 'jsonwebtoken';
import UsuarioModel from '../models/UsuarioModel.js';
import { JWT_CONFIG } from '../config/jwt.js';

// Controller para operações de autenticação
class AuthController {

    // POST /auth/login - Fazer login
    static async login(req, res) {
        try {
            const { email, senha } = req.body;

            // Validações básicas
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
                    mensagem: 'A Senha é obrigatória'
                });
            }

            // Validação básica de formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Email inválido',
                    mensagem: 'Formato de email inválido'
                });
            }

            // Verificar credenciais
            const usuario = await UsuarioModel.verificarCredenciais(email.trim(), senha);

            if (!usuario) {
                return res.status(401).json({
                    sucesso: false,
                    erro: 'Credenciais inválidas',
                    mensagem: 'Email ou senha incorretos'
                });
            }

            // Gerar token JWT
            const token = jwt.sign(
                {
                    id: usuario.id,
                    email: usuario.email,
                    tipo: usuario.tipo
                },
                JWT_CONFIG.secret,
                { expiresIn: JWT_CONFIG.expiresIn }
            );

            res.status(200).json({
                sucesso: true,
                mensagem: 'Login realizado com sucesso',
                dados: {
                    token,
                    usuario: {
                        id: usuario.id,
                        nome_social: usuario.nome_social,
                        email: usuario.email
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível processar o login'
            });
        }
    }

    // POST /auth/registrar - Registrar novo usuário
    static async registrar(req, res) {
        try {
            const { nome_social, email, senha, cnpj, telefone /*, tipo */} = req.body;

            // Validações básicas
            if (!nome_social || nome_social.trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome social obrigatório',
                    mensagem: 'O nome social é obrigatório'
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
                    erro: 'nome_social muito curto',
                    mensagem: 'O nome_social deve ter pelo menos 2 caracteres'
                });
            }

            if (nome_social.length > 255) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'nome_social muito longo',
                    mensagem: 'O nome_social deve ter no máximo 255 caracteres'
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

            if (senha.length < 8) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'senha muito curta',
                    mensagem: 'A senha deve ter pelo menos 8 caracteres'
                });
            }

            // Verificar se o email já existe
            const emailExistente = await UsuarioModel.buscarPorEmail(email);
            if (emailExistente) {
                return res.status(409).json({
                    sucesso: false,
                    erro: 'Email já cadastrado',
                    mensagem: 'Este email já está sendo usado por outro usuário'
                });
            }

            // Verificar se o CNPJ já existe
            const cnpjExistente = await UsuarioModel.buscarPorCNPJ(cnpj);
            if (cnpjExistente) {
                return res.status(409).json({
                    sucesso: false,
                    erro: 'CNPJ já cadastrado',
                    mensagem: 'Este CNPJ já está cadastrado'
                });
            }

            // Preparar dados do usuário
            const dadosUsuario = {
                nome_social: nome_social.trim(),
                email: email.trim().toLowerCase(),
                senha: senha, 
                cnpj: cnpj.replace(/[^\d]/g, ''),
                telefone: telefone || null
            };

            // Criar usuário
            const usuarioId = await UsuarioModel.criar(dadosUsuario);

            res.status(201).json({
                sucesso: true,
                mensagem: 'Usuário registrado com sucesso',
                dados: {
                    id: usuarioId,
                    nome_social: dadosUsuario.nome_social,
                    email: dadosUsuario.email,
                    cnpj: dadosUsuario.cnpj
                    /* tipo: dadosUsuario.tipo */
                }
            });
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível registrar o usuário'
            });
        }
    }
}

export default AuthController;

