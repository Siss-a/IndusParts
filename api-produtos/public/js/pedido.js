function getToken() {
    return localStorage.getItem("token");
}

// Formatar data
function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Carregar lista de pedidos
async function carregarPedidos() {
    try {
        const token = getToken();
        if (!token) {
            alert("Você precisa estar logado!");
            window.location.href = "/login";
            return;
        }

        const response = await fetch("http://localhost:3000/api/pedidos", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        // Esconder loading
        document.getElementById("loading").style.display = "none";

        if (!data.sucesso) {
            alert(data.mensagem);
            return;
        }

        if (data.pedidos.length === 0) {
            document.getElementById("sem-pedidos").style.display = "block";
        } else {
            document.getElementById("lista-pedidos").style.display = "block";
            exibirPedidos(data.pedidos);
        }

    } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        document.getElementById("loading").style.display = "none";
        alert("Erro ao carregar pedidos. Tente novamente.");
    }
}

// Exibir pedidos na página
function exibirPedidos(pedidos) {
    const container = document.getElementById("lista-pedidos");
    container.innerHTML = "";

    pedidos.forEach(pedido => {
        const pedidoCard = document.createElement("div");
        pedidoCard.className = "col-12 mb-3";
        
        pedidoCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-3">
                            <h6 class="mb-1">Pedido #${pedido.numero_pedido}</h6>
                            <small class="text-muted">${formatarData(pedido.criado_em)}</small>
                        </div>
                        <div class="col-md-3">
                            <small class="text-muted d-block">Itens</small>
                            <strong>${pedido.total_itens} produto(s)</strong>
                        </div>
                        <div class="col-md-3">
                            <small class="text-muted d-block">Total</small>
                            <strong class="text-success">R$ ${parseFloat(pedido.total).toFixed(2)}</strong>
                        </div>
                        <div class="col-md-3 text-end">
                            <button class="btn btn-primary btn-sm" onclick="verDetalhes(${pedido.id})">
                                <i class="bi bi-eye"></i> Ver Detalhes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(pedidoCard);
    });
}

// Ver detalhes de um pedido específico
async function verDetalhes(pedidoId) {
    try {
        const token = getToken();
        if (!token) {
            alert("Você precisa estar logado!");
            return;
        }

        const response = await fetch(`http://localhost:3000/api/pedidos/${pedidoId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!data.sucesso) {
            alert(data.mensagem);
            return;
        }

        exibirDetalhesPedido(data.pedido);

        // Abrir modal
        const modal = new bootstrap.Modal(document.getElementById('modalDetalhes'));
        modal.show();

    } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
        alert("Erro ao carregar detalhes do pedido.");
    }
}

// Exibir detalhes do pedido no modal
function exibirDetalhesPedido(pedido) {
    const container = document.getElementById("detalhes-pedido");
    
    // Calcular total
    const total = pedido.itens.reduce((acc, item) => {
        return acc + (item.preco_unitario * item.quantidade);
    }, 0);

    let itensHTML = "";
    pedido.itens.forEach(item => {
        itensHTML += `
            <div class="d-flex align-items-center border-bottom pb-3 mb-3">
                <img src="${item.img || '/uploads/placeholder.jpg'}" 
                     class="img-thumbnail me-3" 
                     style="width: 80px; height: 80px; object-fit: cover;">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.nome}</h6>
                    <small class="text-muted">
                        Quantidade: ${item.quantidade} x R$ ${parseFloat(item.preco_unitario).toFixed(2)}
                    </small>
                </div>
                <div class="text-end">
                    <strong>R$ ${(item.preco_unitario * item.quantidade).toFixed(2)}</strong>
                </div>
            </div>
        `;
    });

    container.innerHTML = `
        <div class="mb-4">
            <h6 class="text-muted">Número do Pedido</h6>
            <p class="mb-0"><strong>${pedido.numero_pedido}</strong></p>
        </div>

        <div class="mb-4">
            <h6 class="text-muted">Data do Pedido</h6>
            <p class="mb-0">${formatarData(pedido.criado_em)}</p>
        </div>

        <div class="mb-4">
            <h6 class="text-muted">Endereço de Entrega</h6>
            <p class="mb-0">${pedido.endereco}</p>
        </div>

        <div class="mb-4">
            <h6 class="text-muted mb-3">Itens do Pedido</h6>
            ${itensHTML}
        </div>

        <div class="bg-light p-3 rounded">
            <div class="d-flex justify-content-between">
                <strong>Total do Pedido:</strong>
                <strong class="text-success fs-5">R$ ${total.toFixed(2)}</strong>
            </div>
        </div>
    `;
}

// Carregar pedidos ao carregar a página
document.addEventListener("DOMContentLoaded", carregarPedidos);