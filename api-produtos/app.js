import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
//import path from 'path';
//import { fileURLToPath } from 'url';

import produtoRoutes from "./routes/ProdutoRoutes.js";
import carrinhoRoutes from "./routes/CarrinhoRoutes.js";
import pedidoRoutes from "./routes/PedidosRoutes.js";
//import usuariosRotas from "./routes/UsuarioRotas.js";
import categoriaRoutes from './routes/CategoriaRoutes.js';
//import dashboardRoutes from './routes/DashboardRoutes.js'

// Importar rotas
import authRotas from './routes/authRotas.js';
import usuariosRotas from './routes/usuariosRotas.js'
//import produtoRotas from './routes/produtoRotas.js';

// Importar middlewares
// import { logMiddleware } from './middlewares/logMiddleware.js';
//import { errorMiddleware } from './middlewares/errorMiddleware.js';

// Carregar variáveis do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://cdn.jsdelivr.net",
                "https://cdnjs.cloudflare.com"
            ],
            scriptSrcElem: [
                "'self'",
                "https://cdn.jsdelivr.net",
                "https://cdnjs.cloudflare.com"
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://cdn.jsdelivr.net",
                "https://fonts.googleapis.com"
            ],
            fontSrc: [
                "'self'",
                "https://cdn.jsdelivr.net",
                "https://fonts.gstatic.com"
            ],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"]
        }
    }
}));

// Configuração CORS global
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 200
}));

app.use(express.json());

// Rotas da API
app.use('/api/auth', authRotas);
app.use('/api/produtos', produtoRoutes);
app.use('/api/usuarios', usuariosRotas);
app.use('/api/carrinho', carrinhoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/categorias', categoriaRoutes);

app.use('/uploads', express.static('uploads'));


// Rota raiz
app.get('/', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: 'IndusParts - Sistema de venda de produtos industriais',
        versao: '1.0.0',
        rotas: {
            autenticacao: '/api/auth',
            produtos: '/api/produtos',
            usuarios: '/api/usuarios',
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
            listarUsuarios: 'GET /api/usuarios',
            criarUsuario: 'POST /api/usuarios',
            atualizarUsuario: 'PUT /api/usuarios/:id',
            excluirUsuario: 'DELETE /api/usuarios/:id'
        }
    });
});

// Middleware para tratar rotas não encontradas
app.use((req, res) => {
    res.status(404).json({
        sucesso: false,
        erro: 'Rota não encontrada',
        mensagem: `A rota ${req.method} ${req.originalUrl} não foi encontrada`
    });
});

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({
        sucesso: false,
        erro: 'Erro interno do servidor',
        mensagem: process.env.NODE_ENV === 'development' ? err.message : 'Ocorreu um erro inesperado'
    });
});

app.listen(PORT, () => {
    console.log(`Acesse: http://localhost:${PORT}`);
    console.log(`API de Produtos Industriais - IndusParts`);
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});