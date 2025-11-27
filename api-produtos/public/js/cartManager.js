const CART_KEY = "meucarrinho";

// Recupera o carrinho
function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

// Salva o carrinho
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Adiciona item ao carrinho
export function addToCart(produto) {
    const cart = getCart();

    const existente = cart.find(item => item.id === produto.id);

    if (existente) {
        existente.quantidade += 1;
    } else {
        cart.push({ ...produto, quantidade: 1 });
    }

    saveCart(cart);
}

// Remove item
export function removeFromCart(id) {
    const cart = getCart().filter(item => item.id !== id);
    saveCart(cart);
}

// Atualiza quantidade
export function updateQuantity(id, quantidade) {
    const cart = getCart();

    const item = cart.find(p => p.id === id);
    if (!item) return;

    if (quantidade <= 0) {
        removeFromCart(id);
        return;
    }

    item.quantidade = quantidade;
    saveCart(cart);
}

// Limpa o carrinho inteiro
export function clearCart() {
    localStorage.removeItem(CART_KEY);
}

// Total geral
export function getCartTotal() {
    const cart = getCart();
    return cart.reduce((t, p) => t + p.preco * p.quantidade, 0);
}

// Quantidade total
export function getCartCount() {
    const cart = getCart();
    return cart.reduce((t, p) => t + p.quantidade, 0);
}
