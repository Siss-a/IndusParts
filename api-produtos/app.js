import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rotas
import authRotas from './routes/authRotas.js';
import adminRotas from './routes/adminRotas.js';
import usuariosRotas from './routes/usuariosRotas.js'

// Importar middlewares
// import { logMiddleware } from './middlewares/logMiddleware.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

// Carregar variáveis do arquivo .env
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações do servidor
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(helmet()); // Segurança HTTP

// Configuração CORS global
app.use(cors({
    origin: '*', // Permitir todas as origens. Ajuste conforme necessário. Ex.: 'http://meufrontend.com'
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
    preflightContinue: false, // Não passar para o próximo middleware
    optionsSuccessStatus: 200 // Responder com 200 para requisições OPTIONS
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para log de requisições (salva no banco de dados)
// app.use(logMiddleware);

// Rotas de Frontend (páginas estáticas)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});
app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'cadastro.html'));
});
app.get('/perfil', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'dashboard.html'));
});
app.get('/crud-produtos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'crudprodutos.html'));
});
app.get('/crud-usuarios', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'crudusuarios.html'));
});
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});
app.get('/catalogo', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'catalogo.html'));
});

// Rotas da API
app.use('/api/auth', authRotas);
app.use('/api/produtos', produtoRotas);
app.use('/api/admin', adminRotas);
app.use('/api/usuarios', usuariosRotas);
//


// Rota raiz
app.get('/', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: 'IndusParts - Sistema de venda de produtos industriais',
        versao: '1.0.0',
        rotas: {
            autenticacao: '/api/auth',
            produtos: '/api/produtos',
            admin: '/api/admin',
        },
        documentacao: {
            login: 'POST /api/auth/login',
            registrar: 'POST /api/auth/registrar',
            perfil: 'GET /api/auth/perfil',
            listarProdutos: 'GET /api/produtos',
            buscarProduto: 'GET /api/produtos/:id',
            criarProduto: 'POST /api/produtos',
            atualizarProduto: 'PUT /api/produtos/:id',
            excluirProduto: 'DELETE /api/produtos/:id',
            listarUsuarios: 'GET /api/admin/usuarios',
            criarUsuario: 'POST /api/admin/usuarios',
            atualizarUsuario: 'PUT /api/admin/usuarios/:id',
            excluirUsuario: 'DELETE /api/admin/usuarios/:id'
        }
    });
});

// Middleware para tratar rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        sucesso: false,
        erro: 'Rota não encontrada',
        mensagem: `A rota ${req.method} ${req.originalUrl} não foi encontrada`
    });
});

// Middleware global de tratamento de erros (deve ser o último)
app.use(errorMiddleware);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Acesse: http://localhost:${PORT}`);
    console.log(`API de Produtos Industriais - IndusParts`);
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

export default app;