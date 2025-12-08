window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/login';
        return;
    }

    try {
        const res = await fetch('/api/usuarios', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Se o middleware do backend bloquear → não é admin
        if (res.status === 401 || res.status === 403) {
            alert("Acesso restrito aos administradores.");
            window.location.href = '/perfil';
            return;
        }

        // usuário é admin → continua a página normalmente
        const resposta = await res.json();
        console.log("Admin confirmado:", resposta);

    } catch (error) {
        console.error("Erro ao validar administrador:", error);
        localStorage.removeItem("token");
        window.location.href = "/login";
    }
});

/* debounce */
function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(null, args), delay);
    };
}

/* Objeto filtros */
const filtros = {
    texto: "",
    categoria: "",
    pagina: 1,
    limite: 10
};

/* CADASTRO DE PRODUTOS */
document.getElementById('formCadastro').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nome', document.getElementById('nome').value);
    formData.append('descricao', document.getElementById('descricao').value);
    formData.append('preco', document.getElementById('preco').value);
    formData.append('estoque', document.getElementById('estoque').value);
    formData.append('categoria', document.getElementById('categoria').value);
    formData.append('fornecedor', document.getElementById('fornecedor').value || '');
    formData.append('especificacoes', document.getElementById('especificacoes')?.value || '');

    const imagemFile = document.getElementById('imagem').files[0];
    if (imagemFile) {
        formData.append('imagem', imagemFile);
    }

    const mensagemEl = document.getElementById('mensagemCadastro');
    mensagemEl.innerHTML = '<p style="color: blue;">⏳ Cadastrando produto...</p>';

    try {
        const token = localStorage.getItem("token");

        const res = await fetch('/api/produtos', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const dados = await res.json();

        if (!res.ok || !dados.sucesso) {
            mensagemEl.innerHTML = `<p style="color: red;">❌ Erro: ${dados.erro || dados.mensagem}</p>`;
            return;
        }

        mensagemEl.innerHTML = `<p style="color: green;">✅ Produto cadastrado!</p>`;
        document.getElementById('formCadastro').reset();
        carregarProdutos();
        setTimeout(() => mensagemEl.innerHTML = '', 300);

    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
        mensagemEl.innerHTML = `<p style="color: red;">❌ Erro ao cadastrar produto</p>`;
    }
});


/* Carregar produtos */
async function carregarProdutos() {
    const token = localStorage.getItem("token");

    const pagina = document.getElementById("pagina").value;
    const limite = document.getElementById("limite").value;
    const listaProdutos = document.getElementById('listaProdutos');
    listaProdutos.innerHTML = '<p style="text-align: center;">⏳ Carregando produtos...</p>';

    try {
        const res = await fetch(`/api/produtos?pagina=${pagina}&limite=${limite}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const dados = await res.json();

        if (!res.ok || !dados.sucesso) {
            listaProdutos.innerHTML = `<p style="color: red;">❌ Erro: ${dados.erro}</p>`;
            return;
        }

        // ✅ Backend agora retorna { produtos, total, totalPaginas }
        let produtos = dados.dados.produtos || dados.dados;

        // Aplicar filtros localmente
        if (filtros.texto) {
            produtos = produtos.filter(p =>
                p.nome.toLowerCase().includes(filtros.texto.toLowerCase())
            );
        }

        if (filtros.categoria) {
            produtos = produtos.filter(p =>
                p.categoria && p.categoria.toLowerCase().includes(filtros.categoria.toLowerCase())
            );
        }

        // Informações de paginação
        const pag = dados.paginacao || {};
        const infoPaginacao = document.getElementById('infoPaginacao');
        infoPaginacao.innerHTML = `
            <p>📊 Mostrando ${produtos.length} produto(s) | 
            Página ${pag.pagina || 1} de ${pag.totalPaginas || 1} | 
            Total: ${pag.total || 0}</p>
        `;

        // Renderizar produtos
        if (produtos.length === 0) {
            listaProdutos.innerHTML = '<p style="text-align: center; color: #999;"> Nenhum produto encontrado.</p>';
            return;
        }

        listaProdutos.innerHTML = produtos.map(produto => `
            <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; background-color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="display: flex; gap: 15px; align-items: start;">
                    ${produto.img
                ? `<img src="/uploads/imagens/${produto.img}" width="120" height="120" alt="${produto.nome}" style="border-radius: 8px; object-fit: cover;">`
                : '<div style="width: 120px; height: 120px; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #999;">Sem imagem</div>'
            }
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 10px 0; color: #333;">${produto.nome}</h3>
                        <p style="margin: 5px 0;"><strong>ID:</strong> ${produto.id}</p>
                        <p style="margin: 5px 0;"><strong>Preço: </strong>${produto.preco}</p>                        
                        <p style="margin: 5px 0;"><strong>Fornecedor:</strong> ${produto.fornecedor || 'N/A'}</p>
                        <p style="margin: 5px 0;"><strong>Categoria:</strong> ${produto.categoria || 'N/A'}</p>
                        <p style="margin: 5px 0;"><strong>Estoque: </strong>${produto.estoque}</p>                        
                        <p style="margin: 5px 0;"><strong>Descrição:</strong> ${produto.descricao || 'Sem descrição'}</p>
                        ${produto.especificacoes ? `<p style="margin: 5px 0;"><strong>Especificações:</strong> ${produto.especificacoes}</p>` : ''}
                    </div>
                </div>
                <div class="leu" style="margin-top: 15px; display: flex; gap: 10px;">
                    <button class="btn-buy" data-id="${produto.id}" data-bs-toggle="modal" data-bs-target="#modalEdicao">
                        Editar
                    </button>
                    <span class="material-icons lixeira btnExcluir" alt="mini pequena lixera #chorabia" style="cursor: pointer;" data-id="${produto.id}">
                     delete</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        listaProdutos.innerHTML = `<p style="color: red;">❌ Erro ao carregar produtos</p>`;
    }
}

const modalEdicao = document.getElementById("modalEdicao");

modalEdicao.addEventListener("show.bs.modal", async (event) => {
    const botao = event.relatedTarget;
    const id = botao.getAttribute("data-id");
    await editarProduto(id);
});

let produtoAtual
async function editarProduto(id) {
    console.log('Editar produto de id:', id);

    try {
        const token = localStorage.getItem('token');

        const res = await fetch(`/api/produtos/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) return alert("Erro ao buscar");

        const dados = await res.json();

        if (!dados.sucesso) {
            alert('Erro ao carregar produto');
            return;
        }

        produtoAtual = dados.dados;
        console.log('Produto carregado: ', produtoAtual);

        document.getElementById('edit_id').value = id;
        document.getElementById('editNome').value = produtoAtual.nome;
        document.getElementById('editPreco').value = produtoAtual.preco;
        document.getElementById('editDescricao').value = produtoAtual.descricao || '';
        document.getElementById('editCategoria').value = produtoAtual.categoria || '';
        document.getElementById('editFornecedor').value = produtoAtual.fornecedor || '';
        document.getElementById('editEstoque').value = produtoAtual.estoque || '';
        document.getElementById('editEspecificacoes').value = produtoAtual.especificacoes || '';
        document.getElementById('editImagem')

    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        alert('Erro ao carregar dados do produto');
    }
};

/* Salvar edição */
const salvarEdicao = document.getElementById("btnSalvarEdicao");
document.getElementById('formEdicao').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('edit_id').value;
    const formData = new FormData();

    // Captura valores
    const campos = {
        nome: document.getElementById('editNome').value.trim(),
        preco: document.getElementById('editPreco').value,
        descricao: document.getElementById('editDescricao').value.trim(),
        categoria: document.getElementById('editCategoria').value.trim(),
        fornecedor: document.getElementById('editFornecedor').value.trim(),
        estoque: document.getElementById('editEstoque').value,
        especificacoes: document.getElementById('editEspecificacoes').value.trim()
    };

    // Comparação — só envia os campos alterados
    Object.keys(campos).forEach(key => {
        if (campos[key] !== produtoAtual[key] && campos[key] !== "") {
            formData.append(key, campos[key]);
        }
    });

    // Enviar arquivo somente se selecionou
    const imagemFile = document.getElementById('editImagem').files[0];
    if (imagemFile) {
        formData.append("imagem", imagemFile);
    }

    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`/api/produtos/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        const dados = await res.json();

        if (res.ok && dados.sucesso) {
            document.getElementById('mensagemEdicao').innerHTML =
                `<p style="color: green;">✔️ ${dados.mensagem}</p>`;
            // Aguarda o fechamento do modal antes de recarregar
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalEdicao'));
                modal.hide();
                carregarProdutos();
            }, 2000);
        } else {
            document.getElementById('mensagemEdicao').innerHTML =
                `<p style="color: red;">❌ ${dados.erro || dados.mensagem}</p>`;
        }
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        document.getElementById('mensagemEdicao').innerHTML =
            `<p style="color: red;">❌ Erro ao atualizar produto</p>`;
    }
});

window.cancelarEdicao = function () {
    document.getElementById('secaoEdicao').style.display = 'none';
    document.getElementById('formEdicao').reset();
    document.getElementById('mensagemEdicao').innerHTML = '';
};

document.addEventListener("click", e => {
    if (e.target.classList.contains("btnExcluir")) {
        const id = e.target.getAttribute("data-id");
        excluirProduto(id);
    }
});

window.excluirProduto = async function (id) {
    if (!confirm('⚠️ Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita!')) {
        return;
    }

    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`/api/produtos/${id}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`
            }

        });

        const dados = await res.json();

        if (res.ok) {
            alert('✅ ' + dados.mensagem);
            carregarProdutos();
        } else {
            alert(`❌ Erro: ${dados.mensagem || dados.erro}`);
        }
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('❌ Erro ao excluir produto');
    }
};


// Pesquisa por texto (com debounce)
document.getElementById('pesquisa')?.addEventListener('input', debounce(e => {
    filtros.texto = e.target.value;
    filtros.pagina = 1;
    carregarProdutos();
}));

// Filtro por categoria
document.getElementById('filtroCategoria')?.addEventListener('change', e => {
    filtros.categoria = e.target.value;
    filtros.pagina = 1;
    carregarProdutos();
});

// Controles de paginação
document.getElementById('pagina')?.addEventListener('change', e => {
    filtros.pagina = parseInt(e.target.value) || 1;
    carregarProdutos();
});

document.getElementById('limite')?.addEventListener('change', e => {
    filtros.limite = parseInt(e.target.value) || 10;
    filtros.pagina = 1;
    carregarProdutos();
});

// Botão buscar
document.getElementById('btnBuscar')?.addEventListener('click', () => {
    carregarProdutos();
});

window.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
});