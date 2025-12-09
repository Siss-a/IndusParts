function getToken() {
  return localStorage.getItem("token");
}

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

// Carregar pedidos (versão admin)
async function carregarPedidos() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado como admin!");
      window.location.href = "/login";
      return;
    }

    // Mostrar loading
    document.getElementById("loading").style.display = "block";
    document.getElementById("lista-pedidos").style.display = "none";
    document.getElementById("sem-pedidos").style.display = "none";

    const termoBusca = document.getElementById('busca')?.value || '';
    let url = `/admin/todos`;

    if (termoBusca.trim() !== '') {
      url = `/admin/buscar?q=${encodeURIComponent(termoBusca)}`;
    }

    console.log('Buscando:', url); // Debug

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    });

    console.log('Status:', response.status); // Debug

    if (!response.ok) {
      if (response.status === 403) {
        alert("Você não tem permissão de administrador!");
        window.location.href = "/";
        return;
      }
      throw new Error(`Erro: ${response.status}`);
    }

    const pedidosRecebidos = await response.json();

    const pedidos = pedidosRecebidos.pedidos || [];

    console.log('Pedidos recebidos:', pedidos); // Debug

    document.getElementById("loading").style.display = "none";
    document.getElementById("total-pedidos").textContent = pedidos.length;

    if (pedidos.length === 0) {
      document.getElementById("sem-pedidos").style.display = "block";
    } else {
      document.getElementById("lista-pedidos").style.display = "block";
      exibirPedidos(pedidos);
    }

  } catch (error) {
    console.error("Erro ao carregar pedidos:", error);
    document.getElementById("loading").style.display = "none";
    alert("Erro ao carregar pedidos: " + error.message);
  }
}

// Exibir pedidos
function exibirPedidos(pedidos) {
  const container = document.getElementById("lista-pedidos");
  container.innerHTML = "";

  pedidos.forEach(pedido => {
    const pedidoCard = document.createElement("div");
    pedidoCard.className = "col-12 mb-3";

    pedidoCard.innerHTML = `
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-lg-2 col-md-3 mb-2 mb-md-0">
                  <h6 class="mb-1 text-primary">#${pedido.numero_pedido}</h6>
                  <small class="text-muted">${formatarData(pedido.data_pedido)}</small>
                </div>
                <div class="col-lg-2 col-md-3 mb-2 mb-md-0">
                  <small class="text-muted d-block">Cliente</small>
                  <strong>${pedido.nome_cliente || 'N/A'}</strong>
                </div>
                <div class="col-lg-3 col-md-6 mb-2 mb-md-0">
                  <small class="text-muted d-block">Endereço</small>
                  <small class="text-truncate d-block" style="max-width: 250px;" title="${pedido.endereco || 'N/A'}">
                    ${pedido.endereco || 'N/A'}
                  </small>
                </div>
                <div class="col-lg-2 col-md-4 mb-2 mb-md-0">
                  <small class="text-muted d-block">Itens</small>
                  <strong>${pedido.total_itens || 0} produto(s)</strong>
                </div>
                <div class="col-lg-2 col-md-4 mb-2 mb-md-0">
                  <small class="text-muted d-block">Total</small>
                  <strong class="text-success">R$ ${parseFloat(pedido.total || 0).toFixed(2)}</strong>
                </div>
                <div class="col-lg-1 col-md-4 text-end">
                  <button class="btn btn-primary btn-sm" onclick="verDetalhes(${pedido.id})">
                    <i class="bi bi-eye"></i> Ver
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;

    container.appendChild(pedidoCard);
  });
}

// Ver detalhes
async function verDetalhes(pedidoId) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado!");
      return;
    }

    console.log('Buscando detalhes do pedido:', pedidoId); // Debug

    const response = await fetch(`/admin/pedidos/${pedidoId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    });

    const data = await response.json();
    console.log('Detalhes recebidos:', data); // Debug

    if (!data.sucesso) {
      alert(data.mensagem || "Erro ao carregar detalhes");
      return;
    }

    exibirDetalhesPedido(data.pedido);

    const modal = new bootstrap.Modal(document.getElementById('modalDetalhes'));
    modal.show();

  } catch (error) {
    console.error("Erro ao carregar detalhes:", error);
    alert("Erro ao carregar detalhes do pedido: " + error.message);
  }
}

// Exibir detalhes no modal
function exibirDetalhesPedido(pedido) {
  const container = document.getElementById("detalhes-pedido");

  const itens = pedido.itens || [];
  const total = itens.reduce((acc, item) => acc + (item.preco_unitario * item.quantidade), 0);
 

  let itensHTML = "";
  pedido.itens.forEach(item => {
    itensHTML += `
          <div class="d-flex align-items-center border-bottom pb-3 mb-3">
            <img src="${item.img || '/uploads/imagens/al1.png'}" 
                 class="img-thumbnail me-3" 
                 style="width: 80px; height: 80px; object-fit: cover;"
                 onerror="this.src='/uploads/imagens/al1.png'">
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
        <div class="row mb-4">
          <div class="col-md-6">
            <h6 class="text-muted mb-1">Número do Pedido</h6>
            <p class="mb-0"><strong class="text-primary">${pedido.numero_pedido}</strong></p>
          </div>
          <div class="col-md-6">
            <h6 class="text-muted mb-1">Data do Pedido</h6>
            <p class="mb-0">${formatarData(pedido.data_pedido)}</p>
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-md-6">
            <h6 class="text-muted mb-1">Status</h6>
            <p class="mb-0"><span class="badge bg-info">${pedido.status || 'Pendente'}</span></p>
          </div>
          <div class="col-md-6">
            <h6 class="text-muted mb-1">ID Cliente</h6>
            <p class="mb-0">${pedido.id_cliente_empresa}</p>
          </div>
        </div>

        <div class="mb-4">
          <h6 class="text-muted mb-1">Endereço de Entrega</h6>
          <p class="mb-0">${pedido.endereco}</p>
        </div>

        <hr>

        <div class="mb-4">
          <h6 class="text-muted mb-3">Itens do Pedido</h6>
          ${itensHTML}
        </div>

        <div class="bg-light p-3 rounded">
          <div class="d-flex justify-content-between align-items-center">
            <strong class="fs-5">Total do Pedido:</strong>
            <strong class="text-success fs-4">R$ ${total.toFixed(2)}</strong>
          </div>
        </div>
      `;
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  console.log('Página carregada'); // Debug
  carregarPedidos();

  // Busca com debounce
  let timeoutBusca;
  const inputBusca = document.getElementById('busca');
  if (inputBusca) {
    inputBusca.addEventListener('input', () => {
      clearTimeout(timeoutBusca);
      timeoutBusca = setTimeout(() => {
        carregarPedidos();
      }, 500); // Aguarda 500ms após parar de digitar
    });
  }

  // Botão recarregar
  const btnRecarregar = document.getElementById('btn-recarregar');
  if (btnRecarregar) {
    btnRecarregar.addEventListener('click', () => {
      document.getElementById('busca').value = '';
      carregarPedidos();
    });
  }
});