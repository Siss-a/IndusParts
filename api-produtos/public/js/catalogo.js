// Simulação de dados do MySQL
const produtos = [
    { id: 1, nome: "Máquina de Solda MIG 130", categoria: "Mig 130", preco: 523.99, rating: 0, parcelas: "12x" },
    { id: 2, nome: "Soldador MIG 130 Pro", categoria: "Mig 130", preco: 489.90, rating: 4, parcelas: "10x" },
    { id: 3, nome: "Kit Solda MIG 130", categoria: "Mig 130", preco: 599.00, rating: 5, parcelas: "12x" },
    { id: 4, nome: "MIG 130 Industrial", categoria: "Mig 130", preco: 723.50, rating: 4, parcelas: "12x" },
    { id: 5, nome: "Solda MIG 130 Compacta", categoria: "Mig 130", preco: 445.00, rating: 3, parcelas: "10x" },
    { id: 6, nome: "MIG 130 Profissional", categoria: "Mig 130", preco: 823.99, rating: 5, parcelas: "12x" }
];

let filteredProducts = [...produtos];
let selectedCategory = null;
let minPrice = null;
let maxPrice = null;

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');

    if (filteredProducts.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        updateResultsCount(0);
        return;
    }

    noResults.style.display = 'none';

    grid.innerHTML = filteredProducts.map(produto => `
                <div class="col-md-6 col-lg-4">
                    <div class="product-card">
                        <div class="product-image"></div>
                        <div class="product-info">
                            <div class="product-name">${produto.nome}</div>
                            <div class="product-rating">
                                ${'★'.repeat(produto.rating)}${'☆'.repeat(5 - produto.rating)} ${produto.rating}
                            </div>
                            <div class="product-installment">${produto.parcelas} de</div>
                            <div class="product-price">R$${produto.preco.toFixed(2).replace('.', ',')}</div>
                            <div class="product-details">
                                <div class="detail-bar" style="width: 70%; background: #7a8a9a;"></div>
                                <div class="detail-bar small" style="background: #a0a8b0;"></div>
                                <div class="detail-bar dark small"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');

    updateResultsCount(filteredProducts.length);
}

function updateResultsCount(count) {
    document.getElementById('searchResults').textContent = `${count} resultados`;
    document.getElementById('searchResultsMobile').textContent = `${count} resultados`;
}

function applyFilters() {
    filteredProducts = produtos.filter(p => {
        let matches = true;

        if (selectedCategory) {
            matches = matches && p.categoria === selectedCategory;
        }

        if (minPrice !== null) {
            matches = matches && p.preco >= minPrice;
        }

        if (maxPrice !== null) {
            matches = matches && p.preco <= maxPrice;
        }

        return matches;
    });

    renderProducts();
}

function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    if (searchTerm === '') {
        filteredProducts = [...produtos];
    } else {
        filteredProducts = produtos.filter(p =>
            p.nome.toLowerCase().includes(searchTerm) ||
            p.categoria.toLowerCase().includes(searchTerm)
        );
    }

    renderProducts();
}

function setMinPrice() {
    minPrice = Math.min(...produtos.map(p => p.preco));
    maxPrice = null;
    updatePriceDisplay();
    applyFilters();
}

function setMaxPrice() {
    maxPrice = Math.max(...produtos.map(p => p.preco));
    minPrice = null;
    updatePriceDisplay();
    applyFilters();
}

function updatePriceDisplay() {
    const price = maxPrice || minPrice || 523.99;
    const priceStr = `R$${price.toFixed(2).replace('.', ',')}`;
    document.getElementById('priceDisplay').textContent = priceStr;
    document.getElementById('priceDisplayMobile').textContent = priceStr;
}

// Event listeners para categorias desktop
document.querySelectorAll('.category-filter').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedCategory = this.dataset.category;
        applyFilters();
    });
});

// Event listeners para categorias mobile
document.querySelectorAll('.category-filter-mobile').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.category-filter-mobile').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedCategory = this.dataset.category;
        applyFilters();
    });
});

// Enter na busca
document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchProducts();
    }
});

// Renderizar produtos iniciais
renderProducts();