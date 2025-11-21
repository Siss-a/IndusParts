// Configurações da API
const API_CONFIG = {
    BASE_URL: 'http://localhost:3000/api', // Altere para o endereço do seu servidor
    ENDPOINTS: {
        PRODUTOS: '/produtos',
        LOGIN: '/auth/login',
        UPLOAD: '/produtos/upload'
    }
};

// Função para obter o token do localStorage
const getToken = () => {
    return localStorage.getItem('token');
};

// Função para salvar o token
const setToken = (token) => {
    localStorage.setItem('token', token);
};

// Função para remover o token
const removeToken = () => {
    localStorage.removeItem('token');
};

// Função para verificar se está autenticado
const isAuthenticated = () => {
    return !!getToken();
};

// Função para fazer requisições à API
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Adicionar token se existir
    const token = getToken();
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    // Merge das opções
    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, finalOptions);
        const data = await response.json();

        if (!response.ok) {
            throw {
                status: response.status,
                message: data.mensagem || data.erro || 'Erro na requisição',
                data: data
            };
        }

        return data;
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
};

// Função para fazer upload de arquivo
const apiUpload = async (endpoint, formData) => {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;

    const token = getToken();
    const headers = {};

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw {
                status: response.status,
                message: data.mensagem || data.erro || 'Erro no upload',
                data: data
            };
        }

        return data;
    } catch (error) {
        console.error('Erro no upload:', error);
        throw error;
    }
};

// Função para formatar preço
const formatarPreco = (preco) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(preco);
};

// Função para obter URL da imagem
const getImageUrl = (filename) => {
    if (!filename) {
        return 'https://via.placeholder.com/300x200?text=Sem+Imagem';
    }
    return `${API_CONFIG.BASE_URL.replace('/api', '')}/uploads/imagens/${filename}`;
};

// Função para mostrar notificação
const mostrarNotificacao = (mensagem, tipo = 'success') => {
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.textContent = mensagem;
    notificacao.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 6px;
        background-color: ${tipo === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notificacao);

    setTimeout(() => {
        notificacao.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notificacao.remove();
        }, 300);
    }, 3000);
};

// Adicionar animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);