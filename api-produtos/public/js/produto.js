const id = (window.location.pathname.split("/")).pop();
const caracteresID = (id.toString()).length;

const nome = document.getElementById('titulo-produto')
const preco = document.getElementById('preco-produto')
const descricao = document.querySelectorAll('.descricao-produto')
const fornecedor = document.getElementById('fornecedor-produto')
const estoque = document.getElementById('estoque-produto')
const interesses = document.getElementById('productsCarousel')
const imagem = document.getElementById('imagem-produto')
const titulo = document.getElementById('titulo')

console.log('id: ', id)

let produtoSelecionado

try {
    fetch('/api/produtos/:id')
        .then(res => res.json())
        .then(data => {
            return data.dados
        })
        .then(produto => {
            let codigoProduto

            if (caracteresID === 1) {
                codigoProduto = <p>000${produto.id}</p>
            }
            if (caracteresID === 2) {
                codigoProduto = <p>00${produto.id}</p>
            }
            if (caracteresID === 3) {
                codigoProduto = <p>0${produto.id}</p>
            }
            if (caracteresID === 4) {
                codigoProduto = <p>${produto.id}</p>
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
                    produtos.slice(0, 4).forEach(produto => {
                        const card = document.createElement('div')
                        card.className = 'product-card'

                        card.innerHTML = `
                            <a href="/produtos/${categoriaProduto}/${produto.id}">
                                <div class="product-card-img">
                                    <img src="cat.jpg" alt="Alicate de Corte" />
                                </div>
                                <div class="product-card-body">
                                    <h3 class="product-card-title">Alicate de Corte Diagonal 8"</h3>
                                    <div class="product-card-price">R$398,90</div>
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
                descricao.innerText = `${produto.descricao}`
                fornecedor.innerText = `${produto.descricao}`
                estoque.innerText = `${produto.estoque}`
                imagem.src = `/uploads/imagens/${produto.img}`
                titulo.innerText = `${produto.nome}`
        })
} catch (error) {
     console.error('Erro ao procurar produto', err)
}




/* 
const id = (window.location.pathname).split('/')[3] // pega o id do URL
const contaCaracID = (id.toString()).length // conta a quantidade de caracteres que o id tem

//  elementos da página de informação do produto
const tituloProd = document.getElementById('tituloprod')
const caProd = document.getElementById('caprod')
const codProd = document.getElementById('codprod')
const descProd = document.getElementById('descricao_prod')
const imgProd = document.getElementById('imgProd')
const containerInteresses = document.getElementById('produtos_interesse')

console.log('esse é o id: ', id) //  mostra o id que foi pego

// Variável global para armazenar o produto
let produtoAtual = null;

try {
    fetch(`/api/produtos/listar/id/${id}`)
        .then(res => res.json())
        .then(data => {
            return data.dados
        })
        .then(produto => {
            // Armazenar produto globalmente
            produtoAtual = produto;
        
            let codigoProd

            if (contaCaracID == 1) {
                codigoProd = `<p>Cód: 000${produto.id}</p>`
            }
            if (contaCaracID === 2) {
                codigoProd = `<p>Cód: 00${produto.id}</p>`
            }
            if (contaCaracID === 3) {
                codigoProd = `<p>Cód: 0${produto.id}</p>`
            }
            if (contaCaracID === 4) {
                codigoProd = `<p>Cód: ${produto.id}</p>`
            }

            let tipoProd;
            switch (produto.tipo) {
                case 'Facial': tipoProd = 'facial'; break;
                case 'Ocular': tipoProd = 'ocular'; break;
                case 'Corporal': tipoProd = 'corporal'; break;
                case 'Respiratório': tipoProd = 'respiratorio'; break;
                case 'Auditivo': tipoProd = 'auditivo'; break;
                case 'Manual': tipoProd = 'manual'; break;
                case 'Pés e Pernas': tipoProd = 'pesepernas'; break;
                case 'Cabeça': tipoProd = 'cabeca'; break;
                default: tipoProd = 'todos';
            }

            //  buscar produtos da mesma categoria para mostrar em "produtos relacionados"
            fetch(`/api/produtos/listar/${produto.tipo}`)
                .then(res => res.json())
                .then(data => {
                    console.log(data.dados)
                    return data.dados
                })
                .then(produtos => {
                    containerInteresses.innerHTML = ''
                    produtos.slice(0, 4).forEach(produto => {
                        const bloco = document.createElement('div')
                        bloco.classList.add('col-12', 'col-md-3')

                        bloco.innerHTML = `
                        <a href="/produtos/${tipoProd}/${produto.id}">
                            <div class="one-produto">
                                <img src="/uploads/imagens/${produto.img}" alt="" />
                                <h5>${produto.nome}</h5>
                                <p>
                                    CA: ${produto.ca} | <span id="marca-produtos">${produto.marca}</span>
                                </p>
                                <div class="estrelas">
                                    <i class="fi fi-ss-star"></i>
                                    <i class="fi fi-ss-star"></i>
                                    <i class="fi fi-ss-star"></i>
                                    <i class="fi fi-ss-star"></i>
                                    <i class="fi fi-ts-star-sharp-half-stroke"></i>
                                    <p id="quantidade-avaliacoes">(201)</p>
                                </div>
                                <h4 class="preco-produtos" id="preco-produtos">R$${produto.preco}</h4>
                            </div>
                        </a>`

                        containerInteresses.appendChild(bloco)
                    });
                })

            // imprimindo os dados do produto na página de informação do produto
            tituloProd.innerHTML = `${produto.nome}`
            caProd.innerHTML = `<p>C.A: ${produto.ca}</p>`
            codProd.innerHTML = `${codigoProd}`
            descProd.innerHTML = `<p>${produto.descricao}</p>`
            imgProd.src = `/uploads/imagens/${produto.img}`

            // Atualizar preço inicial
            const precoProdElement = document.querySelector('.preco_produto');
            if (precoProdElement) {
                precoProdElement.textContent = `R$ ${produto.preco}`;
            }

            // Configurar botões de quantidade
            configurarBotoesQuantidade();

            // Configurar botão comprar
            configurarBotaoComprar();
        })
} catch (err) {
    console.error('Erro ao procurar produto', err)
}


            // imprimindo os dados do produto na página de informação do produto
            tituloProd.innerHTML = `${produto.nome}`
            caProd.innerHTML = `<p>C.A: ${produto.ca}</p>`
            codProd.innerHTML = `${codigoProd}`
            descProd.innerHTML = `<p>${produto.descricao}</p>`
            imgProd.src = `/uploads/imagens/${produto.img}`

            // Atualizar preço inicial
            const precoProdElement = document.querySelector('.preco_produto');
            if (precoProdElement) {
                precoProdElement.textContent = `R$ ${produto.preco}`;
            }

            // Configurar botões de quantidade
            configurarBotoesQuantidade();

            // Configurar botão comprar
            configurarBotaoComprar();
        })
} catch (err) {
    console.error('Erro ao procurar produto', err)
}

// Função para configurar os botões de aumentar/diminuir
function configurarBotoesQuantidade() {
    const linhas = document.querySelectorAll('.linha_informacoes');

    linhas.forEach(linha => {
        const btnAumentar = linha.querySelector('.aumentar-btn');
        const btnDiminuir = linha.querySelector('.diminuir-btn');
        const input = linha.querySelector('.quantidade-input');

        // adicionar eventos nos botões + e -
            document.querySelectorAll('.aumentar-btn, .diminuir-btn, .quantidade-input').forEach(el => {
                el.addEventListener('click', atualizarPrecoTotal);
                el.addEventListener('input', atualizarPrecoTotal);
            });

        // Input manual
        input.addEventListener('input', () => {
            let valor = parseInt(input.value) || 0;
            if (valor < 0) input.value = 0;
            if (valor > 50) input.value = 50;
            atualizarPrecoTotal();
        });
    });
}

// Função para atualizar preço total
function atualizarPrecoTotal() {
    if (!produtoAtual) return;

    const linhas = document.querySelectorAll('.linha_informacoes');
    let total = 0;

    linhas.forEach(linha => {
        const quantidadeLotes = parseInt(linha.querySelector('.quantidade-input').value) || 0;
        if (quantidadeLotes > 0) {
            // Cada lote = 50 unidades
            const quantidadeUnidades = quantidadeLotes * 50;
            total += quantidadeUnidades * produtoAtual.preco;
        }
    });

    const precoProdElement = document.querySelector('.preco_produto');
    if (precoProdElement) {
        precoProdElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
}

// Função para configurar o botão de comprar
function configurarBotaoComprar() {
    const btnComprar = document.querySelector('.addcarrinho_informacoes');
    
    if (btnComprar) {
        btnComprar.addEventListener('click', () => {
            if (!produtoAtual) {
                alert('Erro: Produto não carregado');
                return;
            }

            const linhas = document.querySelectorAll('.linha_informacoes');
            let itensAdicionados = 0;

            linhas.forEach(linha => {
                const tamanho = linha.dataset.tamanho;
                const quantidadeLotes = parseInt(linha.querySelector('.quantidade-input').value) || 0;

                if (quantidadeLotes > 0) {
                    // Converter lotes em unidades (1 lote = 50 unidades)
                    const quantidadeUnidades = quantidadeLotes * 50;
                    
                    // Verificar se a função global existe
                    if (typeof window.adicionarAoCarrinho === 'function') {
                        window.adicionarAoCarrinho(produtoAtual.id, quantidadeUnidades, tamanho);
                        itensAdicionados++;
                    } else {
                        console.error('Função adicionarAoCarrinho não encontrada');
                        alert('Erro ao adicionar ao carrinho. Recarregue a página.');
                    }
                }
            });

            if (itensAdicionados === 0) {
                alert('Selecione pelo menos um tamanho e quantidade!');
            }
        });
    }
}
*/

/* let codigoProd
if (caracteresID === 5) {
    codigoProd = ´000${produto.id}´
} */

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