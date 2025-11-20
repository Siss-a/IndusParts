// Estado da aplicação
let produtos = [];
let produtosFiltrados = [];
let categorias = new Set();
let paginaAtual = 1;
let totalPaginas = 1;
const itensPorPagina = 12;

// Elementos do DOM
const produtosContainer = document.getElementById('produtos-container');
const paginacaoContainer = document.getElementById('paginacao');
const loadingElement = document.getElementById('loading');
const categoriaFilter = document.getElementById('categoria-filter');
const ordenarSelect = document.getElementById('ordenar');
const buscarInput = document.getElementById('buscar');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    configurarEventos();
});

// Configurar eventos
function configurarEventos() {
    categoriaFilter.addEventListener('change', aplicarFiltros);
    ordenarSelect.addEventListener('change', aplicarOrdenacao);
    buscarInput.addEventListener('input', debounce(aplicarFiltros, 500));
}

// Função debounce para busca
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Carregar todos os produtos
async function carregarProdutos() {
    try {
        mostrarLoading(true);
        
        // Buscar todos os produtos (com limite alto)
        const response = await apiRequest(`${API_CONFIG.ENDPOINTS.PRODUTOS}?limite=100`);
        
        if (response.sucesso) {
            produtos = response.dados;
            produtosFiltrados = [...produtos];
            
            // Extrair categorias únicas
            produtos.forEach(produto => {
                if (produto.categoria) {
                    categorias.add(produto.categoria);
                }
            });
            
            atualizarFiltroCategoria();
            aplicarOrdenacao();
            renderizarProdutos();
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        mostrarErro('Não foi possível carregar os produtos. Tente novamente.');
    } finally {
        mostrarLoading(false);
    }
}

// Atualizar select de categorias
function atualizarFiltroCategoria() {
    categoriaFilter.innerHTML = '<option value="">Todas</option>';
    
    Array.from(categorias).sort().forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        categoriaFilter.appendChild(option);
    });
}

// Aplicar filtros
function aplicarFiltros() {
    const categoriaSelecionada = categoriaFilter.value;
    const termoBusca = buscarInput.value.toLowerCase().trim();
    
    produtosFiltrados = produtos.filter(produto => {
        const matchCategoria = !categoriaSelecionada || produto.categoria === categoriaSelecionada;
        const matchBusca = !termoBusca || 
            produto.nome.toLowerCase().includes(termoBusca) ||
            (produto.descricao && produto.descricao.toLowerCase().includes(termoBusca));
        
        return matchCategoria && matchBusca;
    });
    
    paginaAtual = 1;
    aplicarOrdenacao();
    renderizarProdutos();
}

// Aplicar ordenação
function aplicarOrdenacao() {
    const ordenacao = ordenarSelect.value;
    
    switch (ordenacao) {
        case 'nome-asc':
            produtosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
            break;
        case 'nome-desc':
            produtosFiltrados.sort((a, b) => b.nome.localeCompare(a.nome));
            break;
        case 'preco-asc':
            produtosFiltrados.sort((a, b) => a.preco - b.preco);
            break;
        case 'preco-desc':
            produtosFiltrados.sort((a, b) => b.preco - a.preco);
            break;
    }
    
    renderizarProdutos();
}

// Renderizar produtos
function renderizarProdutos() {
    // Calcular paginação
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const produtosPagina = produtosFiltrados.slice(inicio, fim);
    totalPaginas = Math.ceil(produtosFiltrados.length / itensPorPagina);
    
    // Limpar container
    produtosContainer.innerHTML = '';
    
    if (produtosPagina.length === 0) {
        mostrarEstadoVazio();
        paginacaoContainer.innerHTML = '';
        return;
    }
    
    // Renderizar produtos
    produtosPagina.forEach(produto => {
        const card = criarCardProduto(produto);
        produtosContainer.appendChild(card);
    });
    
    renderizarPaginacao();
}

// Criar card de produto
function criarCardProduto(produto) {
    const card = document.createElement('div');
    card.className = 'produto-card';
    
    const descricao = produto.descricao || 'Sem descrição disponível';
    const categoria = produto.categoria || 'Geral';
    
    card.innerHTML = `
        <img src="${getImageUrl(produto.imagem)}" 
             alt="${produto.nome}" 
             class="produto-imagem"
             onerror="this.src='https://via.placeholder.com/300x200?text=Sem+Imagem'">
        <div class="produto-info">
            <div class="produto-categoria">${categoria}</div>
            <h3 class="produto-nome">${produto.nome}</h3>
            <p class="produto-descricao">${descricao}</p>
            <div class="produto-preco">${formatarPreco(produto.preco)}</div>
        </div>
    `;
    
    return card;
}

// Renderizar paginação
function renderizarPaginacao() {
    if (totalPaginas <= 1) {
        paginacaoContainer.innerHTML = '';
        return;
    }
    
    paginacaoContainer.innerHTML = '';
    
    // Botão anterior
    const btnAnterior = document.createElement('button');
    btnAnterior.textContent = '← Anterior';
    btnAnterior.disabled = paginaAtual === 1;
    btnAnterior.addEventListener('click', () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            renderizarProdutos();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    paginacaoContainer.appendChild(btnAnterior);
    
    // Páginas
    const maxBotoes = 5;
    let inicioPaginas = Math.max(1, paginaAtual - Math.floor(maxBotoes / 2));
    let fimPaginas = Math.min(totalPaginas, inicioPaginas + maxBotoes - 1);
    
    if (fimPaginas - inicioPaginas < maxBotoes - 1) {
        inicioPaginas = Math.max(1, fimPaginas - maxBotoes + 1);
    }
    
    for (let i = inicioPaginas; i <= fimPaginas; i++) {
        const btnPagina = document.createElement('button');
        btnPagina.textContent = i;
        btnPagina.className = i === paginaAtual ? 'active' : '';
        btnPagina.addEventListener('click', () => {
            paginaAtual = i;
            renderizarProdutos();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        paginacaoContainer.appendChild(btnPagina);
    }
    
    // Info
    const info = document.createElement('span');
    info.className = 'paginacao-info';
    info.textContent = `${produtosFiltrados.length} produto(s)`;
    paginacaoContainer.appendChild(info);
    
    // Botão próximo
    const btnProximo = document.createElement('button');
    btnProximo.textContent = 'Próximo →';
    btnProximo.disabled = paginaAtual === totalPaginas;
    btnProximo.addEventListener('click', () => {
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            renderizarProdutos();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    paginacaoContainer.appendChild(btnProximo);
}

// Mostrar estado vazio
function mostrarEstadoVazio() {
    produtosContainer.innerHTML = `
        <div class="empty-state">
            <h3>Nenhum produto encontrado</h3>
            <p>Tente ajustar os filtros de busca</p>
        </div>
    `;
}

// Mostrar/ocultar loading
function mostrarLoading(mostrar) {
    loadingElement.style.display = mostrar ? 'flex' : 'none';
}

// Mostrar erro
function mostrarErro(mensagem) {
    produtosContainer.innerHTML = `
        <div class="empty-state">
            <h3>Erro ao carregar produtos</h3>
            <p>${mensagem}</p>
            <button class="btn btn-primary" onclick="carregarProdutos()">Tentar Novamente</button>
        </div>
    `;
}