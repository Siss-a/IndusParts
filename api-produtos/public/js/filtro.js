/* 
============================================
ARQUIVO: app.js
DESCRIÇÃO: Lógica principal do sistema de filtragem
============================================
*/

// ============================================
// 1. SELEÇÃO DOS ELEMENTOS DO DOM
// ============================================

// Elementos de filtro
const filterCategory = document.getElementById('filterCategory');
const filterBrand = document.getElementById('filterBrand');
const filterPrice = document.getElementById('filterPrice');
const filterRating = document.getElementById('filterRating');
const filterSearch = document.getElementById('filterSearch');
const clearFiltersBtn = document.getElementById('clearFilters');

// Elementos de exibição
const productsGrid = document.getElementById('productsGrid');
const productCount = document.getElementById('productCount');
const noProducts = document.getElementById('noProducts');

// ============================================
// 2. FUNÇÃO PARA RENDERIZAR PRODUTOS NA TELA
// ============================================

/**
 * Renderiza os produtos no grid
 * @param {Array} produtosParaExibir - Array de produtos a serem exibidos
 */
function renderizarProdutos(produtosParaExibir) {
    // Limpa o grid antes de renderizar
    productsGrid.innerHTML = '';
    
    // Se não houver produtos, mostra mensagem
    if (produtosParaExibir.length === 0) {
        noProducts.style.display = 'block';
        productCount.textContent = 'Mostrando 0 produtos';
        return;
    }
    
    // Esconde a mensagem de "nenhum produto"
    noProducts.style.display = 'none';
    
    // Atualiza o contador de produtos
    productCount.textContent = `Mostrando ${produtosParaExibir.length} produto(s)`;
    
    // Itera sobre cada produto e cria o HTML
    produtosParaExibir.forEach(produto => {
        // Cria a coluna do Bootstrap
        const col = document.createElement('div');
        col.className = 'col-md-4 col-sm-6';
        
        // Calcula o desconto se houver preço antigo
        let descontoHTML = '';
        if (produto.precoAntigo) {
            const desconto = Math.round(((produto.precoAntigo - produto.preco) / produto.precoAntigo) * 100);
            descontoHTML = `<span class="discount-badge">-${desconto}%</span>`;
        }
        
        // Define o badge de estoque
        let stockBadgeClass = 'in-stock';
        let stockText = 'Em estoque';
        if (produto.estoque === 0) {
            stockBadgeClass = 'out-stock';
            stockText = 'Sem estoque';
        } else if (produto.estoque < 10) {
            stockBadgeClass = 'low-stock';
            stockText = `Apenas ${produto.estoque} unidades`;
        }
        
        // Gera as estrelas de avaliação
        const estrelas = gerarEstrelas(produto.avaliacao);
        
        // HTML do card do produto
        col.innerHTML = `
            <div class="product-card">
                <img src="${produto.imagem}" alt="${produto.nome}" class="product-img">
                
                <div class="product-category">${formatarCategoria(produto.categoria)}</div>
                <div class="product-brand">${formatarMarca(produto.marca)}</div>
                
                <h3 class="product-title">${produto.nome}</h3>
                
                <div class="rating">
                    ${estrelas}
                    <span class="rating-count">(${produto.numAvaliacoes})</span>
                </div>
                
                <div class="mb-2">
                    ${produto.precoAntigo ? `<span class="old-price">R$ ${produto.precoAntigo.toFixed(2)}</span>` : ''}
                    ${descontoHTML}
                </div>
                
                <div class="price">R$ ${produto.preco.toFixed(2)}</div>
                
                <div class="stock-badge ${stockBadgeClass}">
                    ${stockText}
                </div>
                
                <p class="text-muted small">${produto.descricao}</p>
            </div>
        `;
        
        // Adiciona o card ao grid
        productsGrid.appendChild(col);
    });
}

// ============================================
// 3. FUNÇÃO PARA GERAR ESTRELAS DE AVALIAÇÃO
// ============================================

/**
 * Gera HTML das estrelas de avaliação
 * @param {number} avaliacao - Nota da avaliação (0-5)
 * @returns {string} HTML das estrelas
 */
function gerarEstrelas(avaliacao) {
    let estrelas = '';
    const avaliacaoInt = Math.floor(avaliacao);
    const temMeia = avaliacao % 1 >= 0.5;
    
    // Estrelas cheias
    for (let i = 0; i < avaliacaoInt; i++) {
        estrelas += '<i class="bi bi-star-fill"></i>';
    }
    
    // Meia estrela se necessário
    if (temMeia) {
        estrelas += '<i class="bi bi-star-half"></i>';
    }
    
    // Estrelas vazias
    const estrelasVazias = 5 - avaliacaoInt - (temMeia ? 1 : 0);
    for (let i = 0; i < estrelasVazias; i++) {
        estrelas += '<i class="bi bi-star"></i>';
    }
    
    return estrelas;
}

// ============================================
// 4. FUNÇÕES AUXILIARES DE FORMATAÇÃO
// ============================================

/**
 * Formata o nome da categoria para exibição
 * @param {string} categoria - Nome da categoria
 * @returns {string} Categoria formatada
 */
function formatarCategoria(categoria) {
    const categorias = {
        'alicates': 'Alicates',
        'chaves': 'Chaves',
        'ferramentas': 'Ferramentas Elétricas',
        'medicao': 'Medição'
    };
    return categorias[categoria] || categoria;
}

/**
 * Formata o nome da marca para exibição
 * @param {string} marca - Nome da marca
 * @returns {string} Marca formatada
 */
function formatarMarca(marca) {
    const marcas = {
        'tramontina': 'Tramontina',
        'stanley': 'Stanley',
        'bosch': 'Bosch',
        'dewalt': 'DeWalt'
    };
    return marcas[marca] || marca;
}

// ============================================
// 5. FUNÇÃO PRINCIPAL DE FILTRAGEM
// ============================================

/**
 * Filtra os produtos com base nos critérios selecionados
 * @returns {Array} Array de produtos filtrados
 */
function filtrarProdutos() {
    // Obtém os valores dos filtros
    const categoria = filterCategory.value.toLowerCase();
    const marca = filterBrand.value.toLowerCase();
    const precoRange = filterPrice.value;
    const avaliacaoMin = parseFloat(filterRating.value) || 0;
    const termoBusca = filterSearch.value.toLowerCase().trim();
    
    // Filtra o array de produtos
    return produtos.filter(produto => {
        // 1. Filtro por categoria
        if (categoria && produto.categoria !== categoria) {
            return false;
        }
        
        // 2. Filtro por marca
        if (marca && produto.marca !== marca) {
            return false;
        }
        
        // 3. Filtro por faixa de preço
        if (precoRange) {
            const [min, max] = precoRange.split('-').map(Number);
            if (produto.preco < min || produto.preco > max) {
                return false;
            }
        }
        
        // 4. Filtro por avaliação mínima
        if (produto.avaliacao < avaliacaoMin) {
            return false;
        }
        
        // 5. Filtro por busca de nome
        if (termoBusca && !produto.nome.toLowerCase().includes(termoBusca)) {
            return false;
        }
        
        // Se passou por todos os filtros, retorna true
        return true;
    });
}

// ============================================
// 6. FUNÇÃO PARA APLICAR OS FILTROS
// ============================================

/**
 * Aplica os filtros e atualiza a exibição
 */
function aplicarFiltros() {
    // Filtra os produtos
    const produtosFiltrados = filtrarProdutos();
    
    // Renderiza os produtos filtrados
    renderizarProdutos(produtosFiltrados);
}

// ============================================
// 7. FUNÇÃO PARA LIMPAR TODOS OS FILTROS
// ============================================

/**
 * Limpa todos os filtros e mostra todos os produtos
 */
function limparFiltros() {
    // Reseta todos os campos de filtro
    filterCategory.value = '';
    filterBrand.value = '';
    filterPrice.value = '';
    filterRating.value = '';
    filterSearch.value = '';
    
    // Mostra todos os produtos
    renderizarProdutos(produtos);
}

// ============================================
// 8. EVENT LISTENERS (OUVINTES DE EVENTOS)
// ============================================

// Adiciona event listeners para cada filtro
// Quando o usuário mudar qualquer filtro, aplica a filtragem
filterCategory.addEventListener('change', aplicarFiltros);
filterBrand.addEventListener('change', aplicarFiltros);
filterPrice.addEventListener('change', aplicarFiltros);
filterRating.addEventListener('change', aplicarFiltros);

// Para o campo de busca, usa 'input' para filtrar em tempo real
filterSearch.addEventListener('input', aplicarFiltros);

// Botão de limpar filtros
clearFiltersBtn.addEventListener('click', limparFiltros);

// ============================================
// 9. INICIALIZAÇÃO
// ============================================

/**
 * Função executada quando a página carrega
 * Exibe todos os produtos inicialmente
 */
function inicializar() {
    renderizarProdutos(produtos);
}

// Executa a inicialização quando a página carregar
document.addEventListener('DOMContentLoaded', inicializar);

// ============================================
// RESUMO DO FLUXO DE FUNCIONAMENTO:
// ============================================
// 1. Página carrega → inicializar() → exibe todos os produtos
// 2. Usuário muda filtro → Event listener detecta → aplicarFiltros()
// 3. aplicarFiltros() → filtrarProdutos() → retorna array filtrado
// 4. renderizarProdutos() → cria HTML e exibe na tela
// 5. Usuário clica em "Limpar" → limparFiltros() → mostra tudo novamente
// ============================================