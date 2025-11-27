// Lê ID da URL
const params = new URLSearchParams(window.location.search);
const produtoId = params.get("id");

//validação para se o ID do produto não for valido
if (!produtoId) {
    alert("ID do produto não fornecido!");
    window.location.href = "catalogo.html";
}

// Seletores: pegam os elementos do HTML que serão preenchidos com os dados do produto
const titleEl = document.getElementById("title");
const brandEl = document.getElementById("brand");
const priceEl = document.getElementById("price");
const mainImageEl = document.getElementById("mainImage");
const thumbnailsEl = document.getElementById("thumbnails");
const descricaoEl = document.getElementById("descricao");
const pageTitleEl = document.getElementById("pageTitle");



// Busca produto da API
async function carregarProduto() {

    try {
        // Busca o produto pelo ID usando o serviço
        const produto = await ProdutoService.buscar(produtoId);


        // const resposta = await fetch(`http://localhost:3000/produtos/${produtoId}`);
        //const produto = await resposta.json();

        // Preenche texto
        titleEl.textContent = produto.nome;
        brandEl.textContent = produto.categoria || "Sem categoria";
        priceEl.textContent = `R$ ${produto.preco.toFixed(2)}`;
        descricaoEl.textContent = produto.descricao || "Sem descrição";
        pageTitleEl.textContent = produto.nome;

        //botaão para adicionar no carrinho
const addBtn = document.getElementById("addToCart");
addBtn.dataset.produtoId = produto.id;


        // Imagem principal
        const imgUrl = produto.imagem
            ? `http://localhost:3000/uploads/${produto.imagem}`
            : "https://via.placeholder.com/400"; // img placeholder

        mainImageEl.src = imgUrl;

        // Miniaturas
        thumbnailsEl.innerHTML = "";
        //const imagens = produto.imagens || [produto.imagem];

        const imagens = produto.imagens?.length
            ? produto.imagens
            : (produto.imagem ? [produto.imagem] : []);

        if (imagens.length === 0) {
            thumbnailsEl.innerHTML = "<p>Sem imagens disponíveis</p>";
            return;
        }

        // Cria as miniaturas dinamicamente
        imagens.forEach((img, index) => {
            const div = document.createElement("div");
            div.classList.add("thumbnail-img");
            if (index === 0) div.classList.add("active");

            const imgTag = document.createElement("img");
            imgTag.src = `http://localhost:3000/uploads/${img}`;
            div.appendChild(imgTag);

            // Evento de clique: troca a imagem principal e marca miniatura como ativa
            div.addEventListener("click", () => {
                document.querySelectorAll(".thumbnail-img")
                    .forEach(t => t.classList.remove("active"));
                div.classList.add("active");

                mainImageEl.src = imgTag.src;
            });

            thumbnailsEl.appendChild(div);
        });

    } catch (e) {
        console.error("Erro ao carregar produto", e);
        alert(`Erro ao carregar produto:\n${e.message}`);
        window.location.href = "catalogo.html"; // opcional: redireciona de volta
    }
}


// Botão "Adicionar ao carrinho" com evento
document.getElementById("addToCart").addEventListener("click", async () => {
    const id_produto = window.produtoId;

    const res = await fetch("http://localhost:3000/carrinho/item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_produto, quantidade: 1 })
    });

    const data = await res.json();

    if (data.sucesso) {
        alert("Produto adicionado ao carrinho!");
    } else {
        alert("Erro: " + data.mensagem);
    }
});


carregarProduto();
