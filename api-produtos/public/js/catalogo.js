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

        const produtos = data.dados;
        const barraPesquisa = document.getElementById('pesquisa');
        renderizarProdutos()
        contarProdutos()

        function contarProdutos() {
            const valorPesquisa = barraPesquisa.value.toLowerCase().trim();
            const produtosFiltrados = produtos.filter(produto => produto.nome.toLowerCase().includes(valorPesquisa));
            const quantidadeProd = document.getElementById('quantidade-produtos');
            quantidadeProd.innerHTML = `
            <span>${produtosFiltrados.length} produtos encontrados</span>
            `;

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
            if (produtosFiltrados.length === 1) {
                quantidadeProd.innerHTML = '<p<<span>1</span> produto encontrado</p>'
            }
            if (produtosFiltrados.length >= 2) {
                container.querySelectorAll('.aviso-sem-resultados').forEach(el => el.remove());
            }
        }

        function renderizarProdutos() {
            container.querySelectorAll(".card-produto").forEach(el => el.remove());
            produtos.forEach(produto => {
                const card = document.createElement("div");
                card.className = "col-12 col-sm-6 col-md-3 card-produto";

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

                card.innerHTML = `
                        <a href="/produtos/${categoriaProd}/${produto.id}" class="card h-100 text-decoration-none mx-auto">
                            <img src="/uploads/imagens/${produto.img}" class="card-img-top">
                            <div class="card-body">
                                <h4 class="card-text" style="overflow: hidden; height: 30px;">${produto.nome}</h4>
                                <p>${produto.descricao}</p>

                            </div>
                                <div class="w-100 h-100">
                                    <p class="preco">R$ ${produto.preco}</p>
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
                card.className = "col-12 col-sm-6 col-md-3 card-produto";

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

                card.innerHTML = `
                    <a href="/produtos/${categoriaProd}/${produto.id}" class="card h-100 text-decoration-none mx-auto">
                        <img src="/uploads/imagens/${produto.img}" class="card-img-top">
                        <div class="card-body">
                            <h4 class="card-text" style="overflow: hidden; height: 30px;">${produto.nome}</h4>
                            <p>${produto.descricao}</p>

                        </div>
                        <div class="w-100 h-100">
                                <p class="preco">R$ ${produto.preco}</p>
                        </div>
                    </a>
                `;

                container.appendChild(card);
                setTimeout(() => {
                    card.classList.add("show")
                }, 20)
            })
        }
        barraPesquisa.addEventListener('input', filtrarProdutos);
        barraPesquisa.addEventListener('input', contarProdutos);
    }
    )
