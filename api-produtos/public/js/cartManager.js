// cartManager.js - Gerenciador de Carrinho (Frontend)
// Integrado com API do backend

const API_BASE_URL = '/api';

class CartManager {
    constructor() {
        this.token = this.getToken();
    }

    // Obtém o token JWT do localStorage
    getToken() {
        return localStorage.getItem('token');
    }

    // Verifica se o usuário está autenticado
    isAuthenticated() {
        return !!this.token;
    }

    // Headers padrão para requisições autenticadas
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    // Trata erros de resposta da API
    async handleResponse(response) {
        const data = await response.json();
        
        if (!response.ok) {
            if (response.status === 401) {
                this.handleUnauthorized();
                throw new Error('Sessão expirada. Faça login novamente.');
            }
            
            throw new Error(data.mensagem || 'Erro ao processar requisição');
        }
        
        return data;
    }

    // Redireciona para login quando não autenticado
    handleUnauthorized() {
        localStorage.removeItem('token');
        window.location.href = '/login.html';
    }

    // Verifica autenticação antes de operações
    requireAuth() {
        if (!this.isAuthenticated()) {
            alert('Você precisa estar logado para usar o carrinho');
            window.location.href = '/login.html';
            throw new Error('Não autenticado');
        }
    }

    // Obtém o carrinho completo do usuário
    async getCart() {
        this.requireAuth();

        try {
            const response = await fetch(`${API_BASE_URL}/carrinho`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await this.handleResponse(response);
            return data.carrinho;
        } catch (error) {
            console.error('Erro ao buscar carrinho:', error);
            throw error;
        }
    }

    // Adiciona item ao carrinho
    async addToCart(id_produto, quantidade = 1) {
        this.requireAuth();

        if (!id_produto || typeof id_produto !== 'number') {
            throw new Error('ID do produto inválido');
        }

        if (quantidade < 1) {
            throw new Error('Quantidade deve ser maior que zero');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/carrinho/item`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ 
                    id_produto, 
                    quantidade: parseInt(quantidade) 
                })
            });

            const data = await this.handleResponse(response);
            this.dispatchCartUpdate();
            
            return data;
        } catch (error) {
            console.error('Erro ao adicionar item:', error);
            throw error;
        }
    }

    // Atualiza quantidade de um item no carrinho
    async updateQuantity(id_item, quantidade) {
        this.requireAuth();

        if (!id_item || typeof id_item !== 'number') {
            throw new Error('ID do item inválido');
        }

        if (quantidade < 0) {
            throw new Error('Quantidade não pode ser negativa');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/carrinho/item/${id_item}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify({ quantidade: parseInt(quantidade) })
            });

            const data = await this.handleResponse(response);
            this.dispatchCartUpdate();
            
            return data;
        } catch (error) {
            console.error('Erro ao atualizar quantidade:', error);
            throw error;
        }
    }

    // Remove item do carrinho
    async removeFromCart(id_item) {
        this.requireAuth();

        if (!id_item || typeof id_item !== 'number') {
            throw new Error('ID do item inválido');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/carrinho/item/${id_item}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            const data = await this.handleResponse(response);
            this.dispatchCartUpdate();
            
            return data;
        } catch (error) {
            console.error('Erro ao remover item:', error);
            throw error;
        }
    }

    // Limpa o carrinho inteiro
    async clearCart() {
        this.requireAuth();

        try {
            const response = await fetch(`${API_BASE_URL}/carrinho`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            const data = await this.handleResponse(response);
            this.dispatchCartUpdate();
            
            return data;
        } catch (error) {
            console.error('Erro ao limpar carrinho:', error);
            throw error;
        }
    }

    // Incrementa quantidade de um item
    async incrementItem(id_item, quantidadeAtual) {
        return this.updateQuantity(id_item, quantidadeAtual + 1);
    }

    // Decrementa quantidade de um item
    async decrementItem(id_item, quantidadeAtual) {
        const novaQuantidade = quantidadeAtual - 1;
        
        if (novaQuantidade <= 0) {
            return this.removeFromCart(id_item);
        }
        
        return this.updateQuantity(id_item, novaQuantidade);
    }

    // Calcula o total do carrinho
    async getCartTotal() {
        const cart = await this.getCart();
        return cart.total || 0;
    }

    // Conta total de itens no carrinho
    async getCartCount() {
        try {
            const cart = await this.getCart();
            
            if (!cart.itens || cart.itens.length === 0) {
                return 0;
            }
            
            return cart.itens.reduce((total, item) => total + item.quantidade, 0);
        } catch (error) {
            console.error('Erro ao contar itens:', error);
            return 0;
        }
    }

    // Dispara evento customizado quando carrinho é atualizado
    dispatchCartUpdate() {
        const event = new CustomEvent('cartUpdated', {
            detail: { timestamp: Date.now() }
        });
        window.dispatchEvent(event);
    }

    // Formata valor monetário
    formatPrice(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    // Finaliza compra (checkout)
    async checkout(endereco) {
        this.requireAuth();

        if (!endereco || endereco.trim() === '') {
            throw new Error('Endereço é obrigatório');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/pedidos/checkout`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ endereco: endereco.trim() })
            });

            const data = await this.handleResponse(response);
            this.dispatchCartUpdate();
            
            return data;
        } catch (error) {
            console.error('Erro no checkout:', error);
            throw error;
        }
    }
}
// Exporta instância única (Singleton)
const cartManager = new CartManager();

// Exporta para uso em módulos ES6
export default cartManager;

// Exporta para uso global (window)
if (typeof window !== 'undefined') {
    window.cartManager = cartManager;
}


// Exporta funções individuais para compatibilidade
export const {
    getCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    incrementItem,
    decrementItem,
    getCartTotal,
    getCartCount,
    formatPrice,
    checkout
} = cartManager;