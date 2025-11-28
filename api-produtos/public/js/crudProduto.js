/* window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/login';
        return;
    }

    try {
        const res = await fetch('/api/admin/produtos', {
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
}); */

// Objeto que guarda os filtros aplicados pelo usuário (igual ao catálogo)
const filtros = {
    texto: "",
    categoria: "",
    preco: "",
    pagina: 1,
    limite: 10
};

// Função debounce (igual ao catálogo)
function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(null, args), delay);
    };
}

// Cadastrar novo produto
document.getElementById('formCadastro').addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token")

    const formData = new FormData();
    formData.append('nome', document.getElementById('nome').value);
    formData.append('descricao', document.getElementById('descricao').value);
    formData.append('preco', document.getElementById('preco').value);
    formData.append('categoria', document.getElementById('id_categoria').value);

    const imagemFile = document.getElementById('imagem').files[0];
    if (imagemFile) {
        formData.append('imagem', imagemFile);
    }

    try {
        const response = await fetch('/api/admin/produtos', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });


        if (!response) return;

        const dados = await response.json();

        if (response.ok) {
            document.getElementById('mensagemCadastro').innerHTML =
                `<p style="color: green;">✅ ${dados.mensagem}</p>`;
            document.getElementById('formCadastro').reset();
            carregarProdutos(); // Recarrega a lista
        } else {
            document.getElementById('mensagemCadastro').innerHTML =
                `<p style="color: red;">❌ Erro: ${dados.mensagem || dados.erro}</p>`;
        }
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
        document.getElementById('mensagemCadastro').innerHTML =
            `<p style="color: red;">❌ Erro ao cadastrar produto</p>`;
    }
});

// Carregar lista de produtos (adaptado do catálogo)
async function carregarProdutos() {
    const listaProdutos = document.getElementById('listaProdutos');
    listaProdutos.innerHTML = "⏳ Carregando produtos...";

    try {
        // Buscar todos os produtos
        const response = await fetchWithAuth(`/api/admin/produtos?pagina=${filtros.pagina}&limite=${filtros.limite}`);
        if (!response) return;

        const dados = await response.json();

        if (response.ok) {
            let produtos = dados.dados;

            // Aplicar filtros localmente (igual ao catálogo)

            // Filtro por texto (busca no nome)
            if (filtros.texto) {
                produtos = produtos.filter(p =>
                    p.nome.toLowerCase().includes(filtros.texto.toLowerCase())
                );
            }

            // Filtro por categoria
            if (filtros.categoria) {
                produtos = produtos.filter(p =>
                    p.categoria && p.categoria.toLowerCase() === filtros.categoria.toLowerCase()
                );
            }

            // Filtro por preço
            if (filtros.preco) {
                const [min, max] = filtros.preco.split("-").map(Number);
                produtos = produtos.filter(p =>
                    p.preco >= min && p.preco <= max
                );
            }

            // Informações de paginação
            const infoPaginacao = document.getElementById('infoPaginacao');
            infoPaginacao.innerHTML = `
                <p>📊 Mostrando ${produtos.length} de ${dados.paginacao.total} produtos | 
                Página ${dados.paginacao.pagina} de ${dados.paginacao.totalPaginas}</p>
            `;

            // Lista de produtos
            if (produtos.length === 0) {
                listaProdutos.innerHTML = '<p style="text-align: center; color: #999;">😕 Nenhum produto encontrado com os filtros aplicados.</p>';
                return;
            }

            listaProdutos.innerHTML = produtos.map(produto => `
                <div style="border: 1px solid #ccc; padding: 15px; margin: 10px 0; border-radius: 5px; background-color: #f9f9f9;">
                    <h3 style="margin-top: 0; color: #333;">${produto.nome}</h3>
                    <p><strong>ID:</strong> ${produto.id}</p>
                    <p><strong>Preço:</strong> R$ ${parseFloat(produto.preco).toFixed(2)}</p>
                    <p><strong>Categoria:</strong> ${produto.categoria || 'N/A'}</p>
                    <p><strong>Descrição:</strong> ${produto.descricao || 'Sem descrição'}</p>
                    ${produto.img ? `<img src="/uploads/imagens/${produto.img}" width="100" alt="${produto.nome}" style="border-radius: 5px;">` : '<p style="color: #999;">Sem imagem</p>'}
                    <br>
                    <div style="margin-top: 10px;">
                        <button onclick="editarProduto(${produto.id})" style="background-color: #007bff; color: white; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">
                            ✏️ Editar
                        </button>
                        <button onclick="excluirProduto(${produto.id})" style="background-color: #dc3545; color: white; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer;">
                            🗑️ Excluir
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            listaProdutos.innerHTML =
                `<p style="color: red;">❌ Erro ao carregar produtos: ${dados.mensagem}</p>`;
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        listaProdutos.innerHTML =
            `<p style="color: red;">❌ Erro ao carregar produtos</p>`;
    }
}

// Editar produto
window.editarProduto = async function (id) {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`/api/admin/produtos/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const dados = await response.json();
        if (!response.ok) {
            alert('❌ Erro ao buscar produto');
            return;
        }

        const produto = dados.dados;

        document.getElementById('edit_id').value = produto.id;
        document.getElementById('edit_nome').value = produto.nome;
        document.getElementById('edit_descricao').value = produto.descricao || '';
        document.getElementById('edit_preco').value = produto.preco;
        document.getElementById('edit_categoria').value = produto.categoria || '';
        document.getElementById('secaoEdicao').style.display = 'block';
        document.getElementById('secaoEdicao').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        alert('❌ Erro ao carregar dados do produto');
    }
};


// Salvar edição
document.getElementById('formEdicao').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('edit_id').value;
    const formData = new FormData();

    formData.append('nome', document.getElementById('edit_nome').value);
    formData.append('descricao', document.getElementById('edit_descricao').value);
    formData.append('preco', document.getElementById('edit_preco').value);
    formData.append('categoria', document.getElementById('edit_categoria').value);

    const imagemFile = document.getElementById('edit_imagem').files[0];
    if (imagemFile) {
        formData.append('imagem', imagemFile);
    }

    try {
        const response = await fetchWithAuth(`/api/admin/produtos/${id}`, {
            method: 'PUT',
            body: formData
        });

        if (!response) return;

        const dados = await response.json();

        if (response.ok) {
            document.getElementById('mensagemEdicao').innerHTML =
                `<p style="color: green;">✅ ${dados.mensagem}</p>`;
            setTimeout(() => {
                cancelarEdicao();
                carregarProdutos();
            }, 1500);
        } else {
            document.getElementById('mensagemEdicao').innerHTML =
                `<p style="color: red;">❌ Erro: ${dados.mensagem || dados.erro}</p>`;
        }
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        document.getElementById('mensagemEdicao').innerHTML =
            `<p style="color: red;">❌ Erro ao atualizar produto</p>`;
    }
});

// Cancelar edição
window.cancelarEdicao = function () {
    document.getElementById('secaoEdicao').style.display = 'none';
    document.getElementById('formEdicao').reset();
    document.getElementById('mensagemEdicao').innerHTML = '';
};

// Excluir produto
window.excluirProduto = async function (id) {
    if (!confirm('⚠️ Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita!')) {
        return;
    }

    try {
        const response = await fetchWithAuth(`/api/admin/produtos/${id}`, {
            method: 'DELETE'
        });

        if (!response) return;

        const dados = await response.json();

        if (response.ok) {
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

// Eventos de filtro (igual ao catálogo)

// Filtro de pesquisa por texto (com debounce)
document.getElementById('pesquisa').addEventListener('input', debounce(e => {
    filtros.texto = e.target.value;
    filtros.pagina = 1; // Resetar para página 1
    carregarProdutos();
}));

// Filtro por categoria
document.getElementById('filtroCategoria').addEventListener('change', e => {
    filtros.categoria = e.target.value;
    filtros.pagina = 1;
    carregarProdutos();
});

// Filtro por preço
document.getElementById('filtroPreco').addEventListener('change', e => {
    filtros.preco = e.target.value;
    filtros.pagina = 1;
    carregarProdutos();
});

// Controles de paginação
document.getElementById('pagina').addEventListener('change', e => {
    filtros.pagina = parseInt(e.target.value) || 1;
    carregarProdutos();
});

document.getElementById('limite').addEventListener('change', e => {
    filtros.limite = parseInt(e.target.value) || 10;
    filtros.pagina = 1;
    carregarProdutos();
});

// Botão de buscar
document.getElementById('btnBuscar').addEventListener('click', () => {
    carregarProdutos();
});

// Carregar produtos ao abrir a página
window.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
});