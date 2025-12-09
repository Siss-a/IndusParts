// Utilitário para pegar o token
function getToken() {
  return localStorage.getItem("token");
}

// Utilitário para requisições autenticadas
window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return;
  }

  try {
    const res = await fetch("/api/auth/perfil", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });

    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }
  } catch (err) {
    console.error("Erro ao verificar autenticação:", err);
  }
});

// Adicionar produto ao carrinho
async function adicionarAoCarrinho(produtoId, quantidade = 1) {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("/api/carrinho/adicionar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ produtoId, quantidade }),
    });

    const data = await response.json();

    if (data.sucesso) {
      mostrarNotificacao(data.mensagem, "success");
      atualizarContadorCarrinho(data.dados.totalItens);
    } else {
      mostrarNotificacao(data.erro, "error");
    }

    return data;
  } catch (error) {
    console.error("Erro ao adicionar item:", error);
    mostrarNotificacao("Erro ao adicionar item ao carrinho", "error");
    throw error;
  }
}

// Carregar carrinho completo
async function carregarCarrinho() {

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`/api/carrinho`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });
    const data = await response.json();

    if (!data.sucesso) {
      mostrarNotificacao(data.erro, "error");
      return null;
    }

    renderizarCarrinho(data.dados);
    return data.dados;
  } catch (error) {
    console.error("Erro ao carregar carrinho:", error);
    mostrarNotificacao("Erro ao carregar carrinho", "error");
    return null;
  }
}

// Renderizar carrinho na página
function renderizarCarrinho(dados) {
  const lista = document.getElementById("lista-carrinho");
  const resumo = document.getElementById("resumo-produtos");
  const totalElement = document.getElementById("total");
  const btnCheckout = document.getElementById("btn-checkout");

  if (!lista) return;

  // Limpar conteúdo anterior
  lista.innerHTML = "";
  if (resumo) resumo.innerHTML = '<span class="fs-4">Produtos:</span>';

  // Carrinho vazio
  if (!dados.itens || dados.itens.length === 0) {
    lista.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-cart-x display-1 text-muted"></i>
                <h4 class="mt-3">Seu carrinho está vazio</h4>
                <p class="text-muted">Adicione produtos para continuar comprando</p>
                <a href="/catalogo/todos" class="btn btn-primary">Ir às Compras</a>
            </div>
        `;
    if (btnCheckout) btnCheckout.disabled = true;
    if (totalElement) totalElement.innerText = "R$ 0,00";
    return;
  }

  // Renderizar cada item
  dados.itens.forEach((item) => {
    const itemDiv = criarCardProduto(item);
    lista.appendChild(itemDiv);

    // Adicionar ao resumo
    if (resumo) {
      const subtotal = (
        parseFloat(item.preco) * parseInt(item.quantidade)
      ).toFixed(2);
      resumo.innerHTML += `
                <span>${item.quantidade}x ${item.nome} - R$ ${subtotal}</span>
            `;
    }
  });

  // Atualizar total
  if (totalElement) {
    totalElement.innerText = `R$ ${dados.total}`;
  }

  // Habilitar botão de checkout
  if (btnCheckout) {
    btnCheckout.disabled = false;
  }

  // Atualizar contador
  atualizarContadorCarrinho(dados.totalItens);
}

// Criar card de produto no carrinho
function criarCardProduto(item) {
  const itemDiv = document.createElement("div");
  itemDiv.className = "card mb-3";
  itemDiv.dataset.produtoId = item.produto_id || item.id;

  const preco = parseFloat(item.preco || 0);
  const quantidade = parseInt(item.quantidade || 1);
  const subtotal = (preco * quantidade).toFixed(2);
  const imagem = item.img || item.imagem;

  itemDiv.innerHTML = `
        <div class="card-body">
            <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="/uploads/imagens/${imagem}" class="img-fluid rounded" alt="${item.nome}">
                </div>
                <div class="col-md-4">
                    <h6 class="mb-0">${item.nome || item.produto_nome}</h6>
                    <small class="text-muted">ID: ${item.produto_id || item.id}</small>
                </div>
                <div class="col-md-2">
                    <p class="mb-0">R$ ${preco.toFixed(2)}</p>
                </div>
                <div class="col-md-2">
                    <div class="input-group input-group-sm">
                        <button class="btn btn-outline-secondary btn-menos" type="button">
                            <i class="bi bi-dash"></i>
                        </button>
                        <input type="number" class="form-control text-center qtd-input" 
                               value="${quantidade}" min="1" max="999">
                        <button class="btn btn-outline-secondary btn-mais" type="button">
                            <i class="bi bi-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="col-md-1">
                    <strong>R$ ${subtotal}</strong>
                </div>
                <div class="col-md-1 text-end">
                    <button class="btn btn-danger btn-sm btn-remover">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

  // Event listeners
  const produtoId = item.produto_id || item.id;
  const btnMenos = itemDiv.querySelector(".btn-menos");
  const btnMais = itemDiv.querySelector(".btn-mais");
  const inputQtd = itemDiv.querySelector(".qtd-input");
  const btnRemover = itemDiv.querySelector(".btn-remover");

  btnMenos.addEventListener("click", () => {
    const novaQtd = parseInt(inputQtd.value) - 1;
    if (novaQtd < 1) {
      if (confirm("Deseja remover este item do carrinho?")) {
        removerItem(produtoId);
      }
    } else {
      inputQtd.value = novaQtd;
      atualizarQuantidade(produtoId, novaQtd);
    }
  });

  btnMais.addEventListener("click", () => {
    const novaQtd = parseInt(inputQtd.value) + 1;
    inputQtd.value = novaQtd;
    atualizarQuantidade(produtoId, novaQtd);
  });

  inputQtd.addEventListener("change", () => {
    const novaQtd = parseInt(inputQtd.value);
    if (novaQtd < 1) {
      inputQtd.value = 1;
      atualizarQuantidade(produtoId, 1);
    } else {
      atualizarQuantidade(produtoId, novaQtd);
    }
  });

  btnRemover.addEventListener("click", () => {
    if (confirm("Deseja remover este item do carrinho?")) {
      removerItem(produtoId);
    }
  });

  return itemDiv;
}

// Atualizar quantidade de um produto
async function adicionarAoCarrinho(produtoId, quantidade = 1) {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("/api/carrinho/adicionar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ produtoId, quantidade }),
    });

    const data = await response.json();

    if (data.sucesso) {
      carregarCarrinho();
    } else {
      mostrarNotificacao(data.erro, "error");
      carregarCarrinho(); // Recarregar para restaurar valores corretos
    }
  } catch (error) {
    console.error("Erro ao atualizar quantidade:", error);
    mostrarNotificacao("Erro ao atualizar quantidade", "error");
  }
}

// Remover item do carrinho
async function removerItem(produtoId) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`/api/carrinho/remover/${produtoId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.sucesso) {
      mostrarNotificacao(data.mensagem, "success");
      carregarCarrinho();
    } else {
      mostrarNotificacao(data.erro, "error");
    }
  } catch (error) {
    console.error("Erro ao remover item:", error);
    mostrarNotificacao("Erro ao remover item", "error");
  }
}

// Limpar carrinho
async function limparCarrinho() {
  if (!confirm("Deseja realmente limpar todo o carrinho?")) {
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`/api/carrinho/limpar`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.sucesso) {
      mostrarNotificacao(data.mensagem, "success");
      carregarCarrinho();
    } else {
      mostrarNotificacao(data.erro, "error");
    }
  } catch (error) {
    console.error("Erro ao limpar carrinho:", error);
    mostrarNotificacao("Erro ao limpar carrinho", "error");
  }
}

// Atualizar contador do carrinho no header
async function atualizarContadorCarrinho(total) {
  const contadores = document.querySelectorAll(".carrinho-contador");

  contadores.forEach((contador) => {
    if (total > 0) {
      contador.textContent = total > 99 ? "99+" : total;
      contador.style.display = "inline-block";
    } else {
      contador.style.display = "none";
    }
  });
}

// Buscar contagem de itens (para usar no header)
/* async function buscarContagemCarrinho() {
  try {
    const token = getItem("token");
    const response = await fetch(`/api/carrinho/count`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });
    const data = await response.json();

    if (data.sucesso) {
      atualizarContadorCarrinho(data.dados.totalItens);
    }
  } catch (error) {
    console.error("Erro ao buscar contagem:", error);
  }
} */

// Ir para checkout
function irParaCheckout() {
  window.location.href = "/checkout";
}

// Sistema de notificações
function mostrarNotificacao(mensagem, tipo = "info") {
  // Criar elemento de notificação
  const notif = document.createElement("div");
  notif.className = `alert alert-${tipo === "error" ? "danger" : tipo === "success" ? "success" : "info"
    } 
                       position-fixed top-0 end-0 m-3`;
  notif.style.zIndex = "9999";
  notif.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-${tipo === "error" ? "x-circle" : "check-circle"
    } me-2"></i>
            <span>${mensagem}</span>
        </div>
    `;

  document.body.appendChild(notif);

  // Remover após 3 segundos
  setTimeout(() => {
    notif.remove();
  }, 3000);
}

// Inicializar quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  // Se estiver na página do carrinho
  if (document.getElementById("lista-carrinho")) {
    carregarCarrinho();
  }

  // Botão limpar carrinho
  const btnLimpar = document.getElementById("limpar");
  if (btnLimpar) {
    btnLimpar.addEventListener("click", limparCarrinho);
  }

  // Botão checkout
  const btnCheckout = document.getElementById("btn-checkout");
  if (btnCheckout) {
    btnCheckout.addEventListener("click", irParaCheckout);
  }

  // Atualizar contador em todas as páginas
  /* if (getToken()) {
    buscarContagemCarrinho();
  } */
});

// Exportar funções globais
window.adicionarAoCarrinho = adicionarAoCarrinho;
window.carregarCarrinho = carregarCarrinho;
window.limparCarrinho = limparCarrinho;
window.irParaCheckout = irParaCheckout;
