/* const { createElement } = require("react"); */

/* const { createElement } = require("react"); */

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
    // 1. Busca os produtos do banco
    const res = await fetch("/api/produtos", {
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

/* BIAAAAA
try {
  const container = document.getElementById('carrossel')
  fetch('/api/produtos/')
    .then(res => res.json())
    .then(data => {
      console.log(data.dados)
      return data.dados
    })
    .then(produtos => {
      container.innerHTML = ''
      produtos.slice(0, 8).forEach(produto => {
        console.log(produto)
        let categoriaProd;

        switch (produto.categoria) {
          case 'Usinagem': categoriaProd = 'fresas-de-usinagem'; break;
          case 'Ferramentas de Furação': categoriaProd = 'ferramentas-de-furacao'; break;
          case 'Fixação': categoriaProd = 'fixacao'; break;
          case 'Cortes': categoriaProd = 'cortes'; break;
          case 'Parafusadeiras': categoriaProd = 'parafusadeiras'; break;
          case 'Acessórios para Fixação': categoriaProd = 'acessoriosparafixacao'; break;
          default: categoriaProd = 'todos';
        }

        
        const produtoCarousel = createElement('div')
        produtoCarousel.className = 'col-12 col-md-3'

        produtoCarousel.innerHTML = `
        <a href="" class="card h-100 text-decoration-none">
          <img src="/uploads/imagens/${produto.img} class="card-img-top">
            <div class="card-body">
              <h4 class="card-text">${produto.nome}testee</h4>
              <p>A broca com ponta intercambiável para furação de alto volume.</p>
            </div>
        </a>
        `
      })

      fetch(`/api/produtos/categoria/${produto.categoria}`)
        .then(res => res.json())
        .then(data => {
          console.log(data.dados)
          return data.dados
        })
        .then(produtos => {
          interesses.innerHTML = ''
          produtos.slice(0, 8).forEach(produto => {
            const card = document.createElement('div')
            card.className = 'product-card'

            card.innerHTML = `
                            <a href="/produtos/${categoriaProd}/${produto.id}">
                                <div class="product-card-img">
                                    <img src="/uploads/imagens/${produto.img}" alt="Alicate de Corte" />
                                </div>
                                <div class="product-card-body">
                                    <h3 class="product-card-title">${produto.nome}</h3>
                                    <div class="product-card-price">${produto.preco}</div>
                                    
                                    <div class="product-card-rating">
                                        <i class="bi bi-star-fill"></i>
                                        <i class="bi bi-star-fill"></i>
                                        <i class="bi bi-star-fill"></i>
                                        <i class="bi bi-star-fill"></i>
                                        <i class="bi bi-star-half"></i>
                                        <span class="text-muted ms-1">(203)</span>
                                    </div>
                                </div>
                            </a>
                        `

            interesses.appendChild(card)
          })
        })

      nome.innerHTML = `${produto.nome}`
      preco.innerText = `R$${produto.preco}`
      descricao.forEach(desc => desc.innerText = produto.descricao)
      fornecedor.forEach((el) => el.textContent = produto.fornecedor);
      estoque.innerText = `${produto.estoque}`
      imagem.src = `/uploads/imagens/${produto.img}`
      titulo.innerText = `${produto.nome}`
      codigo.innerHTML = codigoProduto;
      categoria.innerHTML = `${produto.categoria}`
    })
} catch (error) {
  console.error('Erro ao procurar produto', error)
} */