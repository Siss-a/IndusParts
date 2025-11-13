import { create } from '../config/database.js';

// Middleware para registrar logs de acesso
export const logMiddleware = async (req, res, next) => {
    const startTime = Date.now();
    
    // Capturar dados da requisição
    const logData = {
        rota: req.originalUrl,
        metodo: req.method,
        ip_address: req.ip || req.connection.remoteAddress || req.socket.remoteAddress,
        user_agent: req.get('User-Agent'),
        dados_requisicao: {
            headers: {
                'content-type': req.get('Content-Type'),
                'authorization': req.get('Authorization') ? 'Bearer [REDACTED]' : null,
                'user-agent': req.get('User-Agent')
            },
            body: req.method !== 'GET' ? sanitizeRequestBody(req.body) : null,
            query: Object.keys(req.query).length > 0 ? req.query : null
        }
    };

    // Interceptar a resposta
    const originalSend = res.send;
    const originalJson = res.json;
    
    res.send = function(data) {
        const finalLogData = {
            ...logData,
            status_code: res.statusCode,
            tempo_resposta_ms: Date.now() - startTime
        };
        
        // Capturar user_id se autenticado (ATUALIZADO: user_id ao invés de usuario_id)
        if (req.usuario && req.usuario.id) {
            finalLogData.user_id = req.usuario.id;
        }
        
        // Capturar dados da resposta em caso de erro
        if (res.statusCode >= 400) {
            finalLogData.dados_resposta = {
                error: true,
                status: res.statusCode,
                message: typeof data === 'string' ? data.substring(0, 500) : data
            };
        }
        
        // Salvar log de forma assíncrona
        saveLog(finalLogData).catch(error => {
            console.error('Erro ao salvar log:', error);
        });
        
        return originalSend.call(this, data);
    };
    
    res.json = function(data) {
        const finalLogData = {
            ...logData,
            status_code: res.statusCode,
            tempo_resposta_ms: Date.now() - startTime
        };
        
        // Capturar user_id se autenticado
        if (req.usuario && req.usuario.id) {
            finalLogData.user_id = req.usuario.id;
        }
        
        // Capturar dados da resposta em caso de erro
        if (res.statusCode >= 400) {
            finalLogData.dados_resposta = {
                error: true,
                status: res.statusCode,
                message: typeof data === 'object' ? JSON.stringify(data).substring(0, 500) : data
            };
        }
        
        // Salvar log de forma assíncrona
        saveLog(finalLogData).catch(error => {
            console.error('Erro ao salvar log:', error);
        });
        
        return originalJson.call(this, data);
    };

    next();
};

// Função para sanitizar dados sensíveis do body
function sanitizeRequestBody(body) {
    if (!body || typeof body !== 'object') return body;
    
    const sanitized = { ...body };
    
    // Remover campos sensíveis
    const sensitiveFields = ['senha', 'password', 'password_hash', 'token', 'authorization'];
    sensitiveFields.forEach(field => {
        if (sanitized[field]) {
            sanitized[field] = '[REDACTED]';
        }
    });
    
    return sanitized;
}

// Função para salvar o log no banco de dados
async function saveLog(logData) {
    try {
        await create('logs', logData);
    } catch (error) {
        console.error('Erro ao inserir log no banco:', error);
    }
}

// Middleware para logs simples (apenas console)
export const simpleLogMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const usuario = req.usuario ? `[${req.usuario.email}]` : '[Anônimo]';
    
    console.log(`${timestamp} - ${req.method} ${req.originalUrl} ${usuario} - IP: ${req.ip || 'N/A'}`);
    
    next();
};