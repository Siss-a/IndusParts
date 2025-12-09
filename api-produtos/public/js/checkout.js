function getToken() {
    return localStorage.getItem("token");
}

// Carregar itens do carrinho
async function carregarItensCheckout() {
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

        if (!data.sucesso) {
            alert(data.erro);
            return;
        }

        if (data.dados.itens.length === 0) {
            alert("Seu carrinho está vazio!");
            window.location.href = "/carrinho";
            return;
        }

        exibirItensCheckout(data.dados.itens);
        exibirResumo(data.dados.total);

    } catch (error) {
        console.error("Erro ao carregar itens:", error);
        alert("Erro ao carregar itens do carrinho");
    }
}

// Exibir itens no checkout
function exibirItensCheckout(itens) {
    const container = document.getElementById("itens-checkout");
    container.innerHTML = "";

    itens.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "d-flex align-items-center border-bottom pb-3 mb-3";
        itemDiv.innerHTML = `
            <img src="/uploads/imagens/${item.img}" 
                 class="img-thumbnail me-3" 
                 style="width: 80px; height: 80px; object-fit: cover;">
            <div class="flex-grow-1">
                <h6 class="mb-1">${item.nome}</h6>
                <small class="text-muted">Quantidade: ${item.quantidade}</small>
            </div>
            <div class="text-end">
                <strong>R$ ${(item.preco * item.quantidade).toFixed(2)}</strong>
            </div>
        `;
        container.appendChild(itemDiv);
    });
}

// Exibir resumo de valores
function exibirResumo(total) {
    document.getElementById("subtotal").textContent = `R$ ${total}`;
    document.getElementById("total").textContent = `R$ ${total}`;
}

// Buscar CEP via API ViaCEP
async function buscarCEP(cep) {
    try {
        const cepLimpo = cep.replace(/\D/g, '');
        
        if (cepLimpo.length !== 8) {
            return;
        }

        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();

        if (data.erro) {
            alert("CEP não encontrado!");
            return;
        }

        // Preencher campos automaticamente
        document.getElementById("rua").value = data.logradouro || "";
        document.getElementById("bairro").value = data.bairro || "";
        document.getElementById("cidade").value = data.localidade || "";
        document.getElementById("uf").value = data.uf || "";

        // Focar no campo número
        document.getElementById("numero").focus();

    } catch (error) {
        console.error("Erro ao buscar CEP:", error);
    }
}

// Formatar CEP automaticamente
document.getElementById("cep").addEventListener("input", function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 5) {
        value = value.slice(0, 5) + '-' + value.slice(5, 8);
    }
    
    e.target.value = value;
});

// Buscar CEP ao sair do campo
document.getElementById("cep").addEventListener("blur", function(e) {
    buscarCEP(e.target.value);
});

// Finalizar pedido
document.getElementById("btn-finalizar").addEventListener("click", async function() {
    const token = getToken();
    if (!token) {
        alert("Você precisa estar logado!");
        window.location.href = "/login";
        return;
    }

    // Validar campos obrigatórios
    const rua = document.getElementById("rua").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const bairro = document.getElementById("bairro").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const uf = document.getElementById("uf").value.trim();

    if (!rua || !numero || !bairro || !cidade || !uf) {
        alert("Por favor, preencha todos os campos obrigatórios do endereço!");
        return;
    }

    // Montar endereço completo
    const complemento = document.getElementById("complemento").value.trim();
    const observacoes = document.getElementById("observacoes").value.trim();
    
    let endereco = `${rua}, ${numero}`;
    if (complemento) endereco += `, ${complemento}`;
    endereco += ` - ${bairro}, ${cidade}/${uf}`;
    if (observacoes) endereco += ` | Obs: ${observacoes}`;

    // Confirmar pedido
    if (!confirm(`Confirmar pedido?\n\nEndereço de entrega:\n${endereco}`)) {
        return;
    }

    // Desabilitar botão durante o processamento
    const btnFinalizar = document.getElementById("btn-finalizar");
    btnFinalizar.disabled = true;
    btnFinalizar.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processando...';

    try {
        const response = await fetch("http://localhost:3000/api/pedidos/checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ endereco })
        });

        const data = await response.json();

        if (data.sucesso) {
            alert(` ${data.mensagem}\n\nNúmero do Pedido: ${data.numeroPedido}`);
            window.location.href = "/pedidos";
        } else {
            alert(` ${data.mensagem}`);
            btnFinalizar.disabled = false;
            btnFinalizar.innerHTML = '<i class="bi bi-check-circle"></i> Finalizar Pedido';
        }

    } catch (error) {
        console.error("Erro ao finalizar pedido:", error);
        alert("Erro ao processar pedido. Tente novamente.");
        btnFinalizar.disabled = false;
        btnFinalizar.innerHTML = '<i class="bi bi-check-circle"></i> Finalizar Pedido';
    }
});

// Carregar dados ao carregar a página
document.addEventListener("DOMContentLoaded", carregarItensCheckout);