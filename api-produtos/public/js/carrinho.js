function getToken() {
    return localStorage.getItem("token");
}

async function adicionarAoCarrinho(produtoId, quantidade) {
    try {
        const token = getToken();
        if (!token) { 
            alert("Você precisa estar logado!"); 
            window.location.href = "/login";
            return; 
        }

        const response = await fetch("http://localhost:3000/api/carrinho/adicionar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ produtoId, quantidade })
        });

        const data = await response.json();
        console.log(data);

        alert(data.mensagem || data.erro);
        carregarCarrinho();

    } catch (error) {
        console.error("Erro ao adicionar item:", error);
        alert("Erro ao adicionar item ao carrinho");
    }
}

async function carregarCarrinho() {
    try {
        const token = getToken();
        if (!token) { 
            alert("Você precisa estar logado!"); 
            window.location.href = "/login";
            return; 
        }

        const response = await fetch("http://localhost:3000/api/carrinho", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log(data);

        if (!data.sucesso) {
            alert(data.erro);
            return;
        }

        const lista = document.getElementById("lista-carrinho");
        const btnCheckout = document.getElementById("btn-checkout");
        
        if (!lista) return;

        lista.innerHTML = "";

        if (data.dados.itens.length === 0) {
            lista.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-cart-x display-1 text-muted"></i>
                    <h4 class="mt-3">Seu carrinho está vazio</h4>
                    <p class="text-muted">Adicione produtos para continuar comprando</p>
                    <a href="/" class="btn btn-primary">Ir às Compras</a>
                </div>
            `;
            if (btnCheckout) btnCheckout.disabled = true;
            document.getElementById("total").innerText = "Total: R$ 0,00";
            return;
        }

        data.dados.itens.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "card mb-3";
            itemDiv.innerHTML = `
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <img src="${item.img || '/uploads/imagens/pfres.png'}" 
                                 class="img-fluid rounded" 
                                 alt="${item.nome}">
                        </div>
                        <div class="col-md-4">
                            <h6 class="mb-1">${item.nome}</h6>
                            <p class="text-muted mb-0">R$ ${parseFloat(item.preco).toFixed(2)}</p>
                        </div>
                        <div class="col-md-3">
                            <div class="input-group input-group-sm">
                                <button class="btn btn-outline-secondary" type="button" 
                                        onclick="alterarQuantidade(${item.produto_id}, ${item.quantidade - 1})">
                                    <i class="bi bi-dash"></i>
                                </button>
                                <input type="number" class="form-control text-center" 
                                       value="${item.quantidade}" 
                                       min="1"
                                       onchange="atualizarQuantidade(${item.produto_id}, this.value)">
                                <button class="btn btn-outline-secondary" type="button"
                                        onclick="alterarQuantidade(${item.produto_id}, ${item.quantidade + 1})">
                                    <i class="bi bi-plus"></i>
                                </button>
                            </div>
                        </div>
                        <div class="col-md-2 text-end">
                            <strong>R$ ${(item.preco * item.quantidade).toFixed(2)}</strong>
                        </div>
                        <div class="col-md-1 text-end">
                            <button class="btn btn-danger btn-sm" onclick="removerItem(${item.produto_id})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            lista.appendChild(itemDiv);
        });

        document.getElementById("total").innerText = "Total: R$ " + data.dados.total;
        
        if (btnCheckout) {
            btnCheckout.disabled = false;
        }

    } catch (error) {
        console.error("Erro ao listar carrinho:", error);
        alert("Erro ao carregar carrinho");
    }
}

function alterarQuantidade(produtoId, novaQuantidade) {
    if (novaQuantidade < 1) {
        if (confirm("Deseja remover este item do carrinho?")) {
            removerItem(produtoId);
        }
        return;
    }
    atualizarQuantidade(produtoId, novaQuantidade);
}

async function atualizarQuantidade(produtoId, quantidade) {
    try {
        const token = getToken();
        if (!token) { 
            alert("Você precisa estar logado!"); 
            return; 
        }

        const qtd = parseInt(quantidade);
        if (qtd < 1) {
            alert("Quantidade deve ser maior que zero");
            carregarCarrinho();
            return;
        }

        const response = await fetch("http://localhost:3000/api/carrinho/atualizar", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ produtoId, quantidade: qtd })
        });

        const data = await response.json();
        
        if (data.sucesso) {
            carregarCarrinho();
        } else {
            alert(data.erro);
        }

    } catch (error) {
        console.error("Erro ao atualizar item:", error);
        alert("Erro ao atualizar quantidade");
    }
}

async function removerItem(produtoId) {
    try {
        const token = getToken();
        if (!token) { 
            alert("Você precisa estar logado!"); 
            return; 
        }

        const response = await fetch(`http://localhost:3000/api/carrinho/remover/${produtoId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        
        if (data.sucesso) {
            carregarCarrinho();
        } else {
            alert(data.erro);
        }

    } catch (error) {
        console.error("Erro ao remover item:", error);
        alert("Erro ao remover item");
    }
}

function irParaCheckout() {
    window.location.href = "/checkout";
}

// Carregar carrinho ao carregar a página
document.addEventListener("DOMContentLoaded", carregarCarrinho);