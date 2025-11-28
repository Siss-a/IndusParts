document.addEventListener("DOMContentLoaded", async () => {
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
});