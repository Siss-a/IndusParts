function getToken() {
    return localStorage.getItem("token"); 
}

async function adicionarAoCarrinho(produtoId, quantidade) {
    try {
        const token = getToken();

        const response = await fetch("http://localhost:3000/api/carrinho/adicionar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ produtoId, quantidade })
        });

        const data = await response.json();
        console.log(data);

        alert(data.mensagem || data.erro);

    } catch (error) {
        console.error("Erro ao adicionar item:", error);
    }
}

async function carregarCarrinho() {
    try {
        const token = getToken();

        const response = await fetch("http://localhost:3000/api/carrinho", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log(data);

        const lista = document.getElementById("lista-carrinho");
        lista.innerHTML = "";

        data.dados.itens.forEach(item => {
            lista.innerHTML += `
                <li>
                    ${item.nome} - R$ ${item.preco} x ${item.quantidade}
                    <button onclick="removerItem(${item.produto_id})">Remover</button>
                </li>
            `;
        });

        document.getElementById("total").innerText = "Total: R$ " + data.dados.total;

    } catch (error) {
        console.error("Erro ao listar carrinho:", error);
    }
}

async function atualizarQuantidade(produtoId, quantidade) {
    try {
        const token = getToken();

        const response = await fetch("http://localhost:3000/api/carrinho/atualizar", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ produtoId, quantidade })
        });

        const data = await response.json();
        alert(data.mensagem);

    } catch (error) {
        console.error("Erro ao atualizar item:", error);
    }
}

async function removerItem(produtoId) {
    try {
        const token = getToken();

        const response = await fetch(`http://localhost:3000/api/carrinho/remover/${produtoId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        alert(data.mensagem);

        carregarCarrinho();

    } catch (error) {
        console.error("Erro ao remover item:", error);
    }
}
