import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRotas from './routes/AuthRotas.js';
import produtoRoutes from "./routes/ProdutoRoutes.js";
import carrinhoRoutes from "./routes/CarrinhoRoutes.js";
import pedidoRoutes from "./routes/PedidosRoutes.js";
import adminRotas from "./routes/AdminRotas.js";
import usuariosRotas from "./routes/UsuarioRotas.js";
import categoriaRoutes from './routes/CategoriaRoutes.js';
import dashboardRoutes from './routes/DashboardRoutes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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
app.use('/api/admin', adminRotas);
app.use('/api/usuarios', usuariosRotas);
app.use('/api/carrinho', carrinhoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/categorias', categoriaRoutes);
app.use("/dashboard", dashboardRoutes);

app.use('/uploads', express.static('uploads'));


// Rota raiz
app.get('/', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: 'IndusParts - Sistema de venda de produtos industriais',
        versao: '1.0.0',
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