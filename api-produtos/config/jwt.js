import dotenv from 'dotenv';

// Carregar variáveis do arquivo .env
dotenv.config();

// Configurações JWT
export const JWT_CONFIG = {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
};
