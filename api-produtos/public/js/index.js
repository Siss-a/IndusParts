function irParaCarrinho() {
  const token = localStorage.getItem("token");

  if (token) {
    window.location.href = "/carrinho"; // SE ESTIVER LOGADO → carrinho
  } else {
    window.location.href = "/login"; // SE NÃO → login
  }
}

function irParaPerfil() {
  const token = localStorage.getItem("token");

  if (token) {
    window.location.href = "/perfil"; // área do usuário
  } else {
    window.location.href = "/login"; // precisa logar
  }
}

// BOTÕES DO CARRINHO
document
  .getElementById("btnCarrinhoMobile")
  ?.addEventListener("click", irParaCarrinho);
document
  .getElementById("btnCarrinhoDesk")
  ?.addEventListener("click", irParaCarrinho);

// BOTÕES DA CONTA
document
  .getElementById("btnContaMobile")
  ?.addEventListener("click", irParaPerfil);
document
  .getElementById("btnContaDesk")
  ?.addEventListener("click", irParaPerfil);

window.addEventListener("DOMContentLoaded", async () => {
  try {
    // 1. Busca os produtos do banco
    const res = await fetch("/api/usuario/produtos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error(`Erro ao buscar produtos: ${res.status}`);
    const data = await res.json();
    const produtos = data.dados; // array de produtos

    // 2. Seleciona os containers
    const mobileContainer = document.querySelector(".mobile-scroll");
    const carouselInner = document.querySelector("#produtosCarousel .carousel-inner");

    // Limpa conteúdo existente
    mobileContainer.innerHTML = "";
    carouselInner.innerHTML = "";

    // 3. Preenche o scroller mobile
    produtos.forEach(prod => {
      const cardLink = document.createElement("a");
      cardLink.href = ""; // pode colocar link do produto
      cardLink.className = "card-link";

      cardLink.innerHTML = `
        <div class="card">
          <img src="${prod.imagem}" class="card-img-top">
          <div class="card-body">
            <h4 class="card-text">${prod.nome}</h4>
            <p>${prod.descricao}</p>
          </div>
        </div>
      `;
      mobileContainer.appendChild(cardLink);
    });

    // 4. Preenche o carrossel desktop (4 cards por slide)
    const chunkSize = 4;
    for (let i = 0; i < produtos.length; i += chunkSize) {
      const slide = document.createElement("div");
      slide.className = `carousel-item${i === 0 ? " active" : ""}`;

      const row = document.createElement("div");
      row.className = "row g-3 justify-content-center";

      produtos.slice(i, i + chunkSize).forEach(prod => {
        const col = document.createElement("div");
        col.className = "col-12 col-md-3";
        col.innerHTML = `
          <a href="" class="card h-100 text-decoration-none">
            <img src="${prod.imagem}" class="card-img-top">
            <div class="card-body">
              <h4 class="card-text">${prod.nome}</h4>
              <p>${prod.descricao}</p>
            </div>
          </a>
        `;
        row.appendChild(col);
      });

      slide.appendChild(row);
      carouselInner.appendChild(slide);
    }

  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
  }
});
