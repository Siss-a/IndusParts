import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rotas
import authRotas from './routes/authRotas.js';
import companyRotas from './routes/companyRotas.js';

// Importar middlewares
import { logMiddleware } from './middlewares/logMiddleware.js';
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
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware para log de requisições (salva no banco de dados)
app.use(logMiddleware);

// Rotas da API
app.use('/api/auth', authRotas);
app.use('/api/companies', companyRotas);

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: 'API B2B - Sistema de Gestão Empresarial',
        versao: '2.0.0',
        rotas: {
            autenticacao: '/api/auth',
            empresas: '/api/companies'
        },
        documentacao: {
            // Autenticação
            login: 'POST /api/auth/login',
            registrar: 'POST /api/auth/registrar',
            perfil: 'GET /api/auth/perfil',
            
            // Empresas
            listarEmpresas: 'GET /api/companies',
            buscarEmpresa: 'GET /api/companies/:id',
            criarEmpresa: 'POST /api/companies',
            atualizarEmpresa: 'PUT /api/companies/:id',
            excluirEmpresa: 'DELETE /api/companies/:id',
            usuariosEmpresa: 'GET /api/companies/:id/users',
            enderecosEmpresa: 'GET /api/companies/:id/addresses'
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
    console.log(`╔══════════════════════════════════════════╗`);
    console.log(`║   API B2B - Sistema de Gestão            ║`);
    console.log(`║   http://localhost:${PORT}                  ║`);
    console.log(`║   Ambiente: ${process.env.NODE_ENV || 'development'}                  ║`);
    console.log(`╚══════════════════════════════════════════╝`);
});

export default app;