const container = document.getElementById("listaProdutos");
container.querySelectorAll(".card-produto").forEach(el => el.remove());
const categoria = ((window.location.pathname).split("/")).pop(); /* pega o utlimo parametro do url */
let url

if (categoria == "todos") {
    url = '/api/produtos';
}
else {
    url = `/api/produtos/categoria/${categoria}`;
}

fetch(url) /* informacoes dos produtos */
    .then(res => res.json())
    .then(data => {
        console.log(data);

        const produtos = data.dados;
        const barraPesquisa = document.getElementById('pesquisa');
        renderizarProdutos()
        contarProdutos()

        function renderizarProdutos() {
            container.querySelectorAll(".card-produto").forEach(el => el.remove());
            produtos.forEach(produto => {
                const card = document.createElement("div");
                card.className = "col-12 col-sm-6 col-md-3";

                let categoriaProd;
                switch (produto.categoria) {
                    case 'Fresas de Usinagem': categoriaProd = 'fresasdeusinagem'; break;
                    case 'Parafusadeiras': categoriaProd = 'parafusadeiras'; break;
                    case 'Acessórios para Fixação': categoriaProd = 'acessoriosparafixacao'; break;
                    default: categoriaProd = 'todos';
                }

                card.innerHTML = `
                        <a href="/produtos/${categoriaProd}/${produto.id}" class="card h-100 text-decoration-none mx-auto">
                            <img src="/uploads/imagens/${produto.img}" class="card-img-top">
                            <div class="card-body">
                                <h4 class="card-text">${produto.nome}</h4>
                                <p>${produto.descricao}</p>
                            </div>
                        </a>
                `;
                container.appendChild(card);
                setTimeout(() => {
                    card.classList.add("show")
                }, 20)
            })
        }

        function filtrarProdutos() {

            container.querySelectorAll(".card-produto").forEach(el => el.remove());

            const valorPesquisa = barraPesquisa.value.toLowerCase().trim();
            const produtosFiltrados = produtos.filter(produto => produto.nome.toLowerCase().includes(valorPesquisa));

            produtosFiltrados.forEach(produto => {
                const card = document.createElement("div");
                card.className = "card-produto";

                let categoriaProd;
                switch (produto.categoria) {
                    case 'Fresas de Usinagem': categoriaProd = 'fresasdeusinagem'; break;
                    case 'Parafusadeiras': categoriaProd = 'parafusadeiras'; break;
                    case 'Fixação': categoriaProd = 'fixacao'; break;
                    default: categoriaProd = 'todos';
                }

                card.innerHTML = `
                    <div class="col-12 col-sm-6 col-md-3">
                        <a href="/produtos/${categoriaProd}/${produto.id}" class="card h-100 text-decoration-none mx-auto">
                            <img src="/uploads/imagens/${produto.img}" class="card-img-top">
                            <div class="card-body">
                                <h4 class="card-text">${produto.nome}</h4>
                                <p>${produto.descricao}</p>
                            </div>
                        </a>
                    </div>
                `;

                container.appendChild(card);
                setTimeout(() => {
                    card.classList.add("show")
                }, 20)
            })
        }
        barraPesquisa.addEventListener('input', filtrarProdutos);
        barraPesquisa.addEventListener('search', contarProdutos);

        function contarProdutos() {
            const valorPesquisa = barraPesquisa.value.toLowerCase().trim();
            const produtosFiltrados = produtos.filter(produto => produto.nome.toLowerCase().includes(valorPesquisa));
            const quantidadeProd = document.getElementById('quantidade-produtos');
            quantidadeProd.textContent = produtosFiltrados.length;

            if (produtosFiltrados.length === 0) {
                const mensagemAviso = document.getElementById('sem-resultados')
                if (mensagemAviso) {
                    mensagemAviso.remove();
                }

                const mensagem = document.createElement('div');
                mensagem.id = 'sem-resultados';
                mensagem.className = 'aviso-sem-resultados';
                mensagem.innerHTML = `
                    <h3>Nenhum produto encontrado</h3>
                    <p> Sua pesquisa "<strong>${barraPesquisa.value}</strong>" não retornou resultados.</p>
                `
                container.appendChild(mensagem);

                setTimeout(() => {
                    mensagem.classList.add("show")
                }, 20)
            }
            if (produtosFiltrados.length > 0) {
                container.querySelectorAll('.aviso-sem-resultados').forEach(el => el.remove());
            }
        }
    }
    )

/* document.addEventListener("DOMContentLoaded", async () => {
    const listaProdutos = document.getElementById("listaProdutos");

    // Objeto que guarda os filtros aplicados pelo usuário
    const filtros = {
        texto: "",
        categoria: "",
        preco: ""
    };

    // Responsável por carregar e exibir os produtos
    async function carregar() {
        listaProdutos.innerHTML = "Carregando...";

        let produtos = await ProdutoService.listar();

        // Filtro por texto
        if (filtros.texto) {
            produtos = produtos.filter(p =>
                p.nome.toLowerCase().includes(filtros.texto.toLowerCase())
            );
        }

        // Filtro por categoria
        if (filtros.categoria) {
            produtos = produtos.filter(p => p.categoria === filtros.categoria);
        }

        // Filtro por preço
        if (filtros.preco) {
            const [min, max] = filtros.preco.split("-").map(Number);
            produtos = produtos.filter(p =>
                p.preco >= min && p.preco <= max
            );
        }

        // Limpa a lista antes de renderizar os produtos filtrados
        listaProdutos.innerHTML = "";
        // Para cada produto, cria um card e adiciona na lista
        produtos.forEach(p => listaProdutos.appendChild(criarCardProduto(p)));
    }

    // Eventos de interação com o funcionário

    // Filtro de pesquisa por texto (executa com debounce )
    document.getElementById("pesquisa")
        .addEventListener("input", debounce(e => {
            filtros.texto = e.target.value; // atualiza filtro
            carregar(); // recarrega lista
        }));

    // Filtro por categoria
    document.getElementById("filtroCategoria")
        .addEventListener("change", e => {
            filtros.categoria = e.target.value;
            carregar();
        });

    // Filtro por preço
    document.getElementById("filtroPreco")
        .addEventListener("change", e => {
            filtros.preco = e.target.value;
            carregar();
        });

    carregar();
}); */