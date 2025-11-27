// Importa funções (cartManager.js)
import {
    getCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal
} from "./cartManager.js";

const container = document.getElementById("cartContainer");

function renderCart() {
    // Renderiza carrinho
    const cart = getCart();

    // Se o carrinho estiver vazio, mostra mensagem
    if (cart.length === 0) {
        container.innerHTML = "<p>Seu carrinho está vazio.</p>";
        return;
    }

    // Limpa o container antes de renderizar
    container.innerHTML = "";

    cart.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <img src="${item.imagem}" width="80">
            <strong>${item.nome}</strong>
            <p>Preço: R$ ${item.preco.toFixed(2)}</p>

            <div>
                <button class="menos" data-id="${item.id}">-</button>
                <span>${item.quantidade}</span>
                <button class="mais" data-id="${item.id}">+</button>
            </div>

            <button class="remover" data-id="${item.id}">Remover</button>
            <hr>
        `;

        container.appendChild(div);
    });

    // Total do carrinho
    const total = getCartTotal();
    container.innerHTML += `<h2>Total: R$ ${total.toFixed(2)}</h2>`;

    addEventListeners();
}

function addEventListeners() {

    // Botão de aumentar quantidade
    document.querySelectorAll(".mais").forEach(btn => {
        btn.onclick = () => {
            const id = parseInt(btn.dataset.id);
            const item = getCart().find(p => p.id === id);
            updateQuantity(id, item.quantidade + 1);
            renderCart();
        };
    });

    // Botão de diminuir quantidade
    document.querySelectorAll(".menos").forEach(btn => {
        btn.onclick = () => {
            const id = parseInt(btn.dataset.id);
            const item = getCart().find(p => p.id === id);
            updateQuantity(id, item.quantidade - 1);
            renderCart();
        };
    });

    // Botão de remover item
    document.querySelectorAll(".remover").forEach(btn => {
        btn.onclick = () => {
            removeFromCart(parseInt(btn.dataset.id));
            renderCart();
        };
    });
}

// Botão de limpar carrinho inteiro
document.getElementById("limpar").onclick = () => {
    clearCart();
    renderCart();
};

renderCart();
