const id = (window.location.pathname.split("/")).pop();
const caracteresID = (id.toString()).length;

console.log(id)
const nome = document.getElementById('titulo-produto')
const preco = document.getElementById('preco-produto')
const estoque = document.getElementById('estoque-produto')
const interesses = document.getElementById('productsCarousel')
const imagem = document.getElementById('imagem-produto')
const titulo = document.getElementById('titulo')
const descricao = document.querySelectorAll(".descricao-produto");
const codigo = document.getElementById("codigo-produto")
const fornecedor = document.querySelectorAll(".nome-empresa")

let produtoSelecionado

try {
    fetch(`/api/produtos/${id}`)
        .then(res => res.json())
        .then(data => {
            return data.dados
        })
        .then(produto => {
            let codigoProduto

            if (caracteresID === 1) {
                codigoProduto = `<p>000${produto.id}</p>`
            }
            if (caracteresID === 2) {
                codigoProduto = `<p>00${produto.id}</p>`
            }
            if (caracteresID === 3) {
                codigoProduto = `<p>0${produto.id}</p>`
            }
            if (caracteresID === 4) {
                codigoProduto = `<p>${produto.id}</p>`
            }

            let categoriaProd;
            switch (produto.categoria) {
                case 'Fresas de Usinagem': categoriaProd = 'fresasdeusinagem'; break;
                case 'Parafusadeiras': categoriaProd = 'parafusadeiras'; break;
                case 'Fixação': categoriaProd = 'fixacao'; break;
                default: categoriaProd = 'todos';
            }

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
            preco.innerText = `${produto.preco}`
            descricao.forEach(desc => desc.innerText = produto.descricao)
            fornecedor.forEach((el) => (el.textContent = produto.fornecedor));
            estoque.innerText = `${produto.estoque}`
            imagem.src = `/uploads/imagens/${produto.img}`
            titulo.innerText = `${produto.nome}`
            codigo.innerHTML = codigoProduto;
        })
} catch (error) {
    console.error('Erro ao procurar produto', error)
}

/* const params = new URLSearchParams(window.location.search);
const produtoId = params.get("id");

// Validação para se o ID do produto não for válido
if (!produtoId) {
    alert("ID do produto não fornecido!");
    window.location.href = "catalogo.html";
}

// Seletores do HTML
const titleEl = document.getElementById("title");
const brandEl = document.getElementById("brand");
const priceEl = document.getElementById("price");
const mainImageEl = document.getElementById("mainImage");
const thumbnailsEl = document.getElementById("thumbnails");
const descricaoEl = document.getElementById("descricao");
const pageTitleEl = document.getElementById("pageTitle");
const addBtn = document.getElementById("addToCart");

// Função para carregar o produto
async function carregarProduto() {
    try {
        // Tenta pegar o produto do localStorage (vindo da página anterior)
        let produto = JSON.parse(localStorage.getItem("produtoSelecionado"));

        // Se não tiver ou ID diferente, busca da API
        if (!produto || produto.id != produtoId) {
            const resposta = await ProdutoService.buscar(produtoId);
            produto = resposta.dados || resposta;
        }

        // Preenche texto
        titleEl.textContent = produto.nome; "Sem categoria";
        priceEl.textContent = `R$ ${produto.preco.toFixed(2)}`;
        descricaoEl.textContent = produto.descricao || "Sem descrição";
        pageTitleEl.textContent = produto.nome;

        // Botão adicionar ao carrinho
        addBtn.dataset.produtoId = produto.id;

        // Imagem principal
        const imgUrl = produto.img
            ? `http://localhost:3000/uploads/${produto.img}`
            : "https://via.placeholder.com/400";
        mainImageEl.src = imgUrl;

        // Miniaturas
        thumbnailsEl.innerHTML = "";
        const imagens = produto.imagens?.length
            ? produto.imagens
            : (produto.img ? [produto.img] : []);

        if (imagens.length === 0) {
            thumbnailsEl.innerHTML = "<p>Sem imagens disponíveis</p>";
        } else {
            imagens.forEach((img, index) => {
                const div = document.createElement("div");
                div.classList.add("thumbnail-img");
                if (index === 0) div.classList.add("active");

                const imgTag = document.createElement("img");
                imgTag.src = `http://localhost:3000/uploads/${img}`;
                div.appendChild(imgTag);

                div.addEventListener("click", () => {
                    document.querySelectorAll(".thumbnail-img")
                        .forEach(t => t.classList.remove("active"));
                    div.classList.add("active");
                    mainImageEl.src = imgTag.src;
                });

                thumbnailsEl.appendChild(div);
            });
        }

    } catch (e) {
        console.error("Erro ao carregar produto", e);
        alert("Erro ao carregar produto. Redirecionando para catálogo.");
        window.location.href = "catalogo.html";
    }
}

// Função adicionar ao carrinho
async function adicionarAoCarrinho(id_produto) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Você precisa estar logado para adicionar produtos ao carrinho!");
            window.location.href = "/login";
            return;
        }

        const res = await fetch("http://localhost:3000/api/carrinho/item", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ id_produto: parseInt(id_produto), quantidade: 1 })
        });

        const data = await res.json();

        if (res.ok && data.sucesso) {
            const textoOriginal = addBtn.innerHTML;
            addBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Adicionado!';
            addBtn.classList.remove("btn-add-cart");
            addBtn.classList.add("btn-success");
            addBtn.disabled = true;

            setTimeout(() => {
                addBtn.innerHTML = textoOriginal;
                addBtn.classList.remove("btn-success");
                addBtn.classList.add("btn-add-cart");
                addBtn.disabled = false;
            }, 2000);
        } else {
            alert("Erro ao adicionar ao carrinho: " + (data.mensagem || "Erro desconhecido"));
        }
    } catch (error) {
        console.error("Erro ao adicionar ao carrinho:", error);
        alert("Erro ao adicionar produto ao carrinho. Tente novamente.");
    }
}

// Evento do botão
addBtn.addEventListener("click", function() {
    const id_produto = this.dataset.produtoId;
    if (id_produto) {
        adicionarAoCarrinho(id_produto);
    }
});

// Inicializa
carregarProduto();
 */