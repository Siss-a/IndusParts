function irParaCarrinho() {
  const token = localStorage.getItem("token");

  if (token) {
    window.location.href = "/carrinho"; // se estiver logado-> carrinho
  } else {
    window.location.href = "/login"; // não está logado -> login
  }
}

function irParaPerfil() {
  const token = localStorage.getItem("token");

  if (token) {
    window.location.href = "/"; // área do usuário
  } else {
    window.location.href = "/login"; // precisa logar
  }
}

// BOTÕES DO CARRINHO
document.getElementById("btnCarrinhoMobile")
  ?.addEventListener("click", irParaCarrinho);
document.getElementById("btnCarrinhoDesk")
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
    // Pegar os produtos do banco
    const res = await fetch("/api/produtos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error(`Erro ao buscar produtos: ${res.status}`);
    const data = await res.json();
    const produtos = data.dados; // array de produtos

    // Containers com o carrossel
    const mobileContainer = document.querySelector(".mobile-scroll");
    const carouselInner = document.querySelector("#produtosCarousel .carousel-inner");

    // Limpar conteúdo
    mobileContainer.innerHTML = "";
    carouselInner.innerHTML = "";

    //Preenche o scroller mobile
    produtos.forEach(prod => {

      let categoriaProd;
      switch (prod.categoria) {
        case 'Usinagem': categoriaProd = 'fresas-de-usinagem'; break;
        case 'Ferramentas de Furação': categoriaProd = 'ferramentas-de-furacao'; break;
        case 'Fixação': categoriaProd = 'fixacao'; break;
        case 'Cortes': categoriaProd = 'cortes'; break;
        case 'Parafusadeiras': categoriaProd = 'parafusadeiras'; break;
        case 'Acessórios para Fixação': categoriaProd = 'acessoriosparafixacao'; break;
        default: categoriaProd = 'todos';
      }

      const cardLink = document.createElement("a");
      cardLink.href = `/produtos/${categoriaProd}/${prod.id}`; // link do produto
      cardLink.className = "card-link";

      cardLink.innerHTML = `
        <div class="card">
          <img src="/uploads/imagens/${prod.imagem}" class="card-img-top">
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

        let categoriaProd;
        switch (prod.categoria) {
          case 'Usinagem': categoriaProd = 'fresas-de-usinagem'; break;
          case 'Ferramentas de Furação': categoriaProd = 'ferramentas-de-furacao'; break;
          case 'Fixação': categoriaProd = 'fixacao'; break;
          case 'Cortes': categoriaProd = 'cortes'; break;
          case 'Parafusadeiras': categoriaProd = 'parafusadeiras'; break;
          case 'Acessórios para Fixação': categoriaProd = 'acessoriosparafixacao'; break;
          default: categoriaProd = 'todos';
        }

        const col = document.createElement("div");
        col.className = "col-12 col-md-3";
        col.innerHTML = `
          <a href="/produtos/${categoriaProd}/${prod.id}" class="card h-100 text-decoration-none">
            <img src="/uploads/imagens/${prod.img}" class="card-img-top">
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