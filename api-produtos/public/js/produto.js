const id = (window.location.pathname.split("/")).pop();
const caracteresID = (id.toString()).length;

console.log(id)
const nome = document.getElementById('titulo-produto');
const preco = document.getElementById('preco-produto');
const estoque = document.getElementById('estoque-produto');
const interesses = document.getElementById('productsCarousel');
const imagem = document.getElementById('imagem-produto');
const titulo = document.getElementById('titulo');
const codigo = document.getElementById("codigo-produto");
const descricao = document.querySelectorAll(".descricao-produto");
const fornecedor = document.querySelectorAll(".fornecedor-produto");
const categoria = document.getElementById('categoria-produto')

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
}