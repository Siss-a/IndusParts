const id = (window.location.pathname.split("/")).pop();
const caracteresID = (id.toString()).length;

let codigoProd
if (caracteresID === 5) {
    codigoProd = ´000${produto.id}´
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