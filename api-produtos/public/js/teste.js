import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, ChevronDown, Star, Package, TrendingUp, Grid, List } from 'lucide-react';

// Configuração da API
const API_BASE_URL = 'http://localhost:3000/api';

// Componente de Loading
const Loading = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Componente de Erro
const ErrorMessage = ({ message }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
    <p className="font-medium">Erro: {message}</p>
  </div>
);

// Hook customizado para API
const useAPI = () => {
  const fetchProducts = async (params = {}) => {
    const { pagina = 1, limite = 12, busca = '', categoria = '' } = params;
    try {
      const queryParams = new URLSearchParams({
        pagina: pagina.toString(),
        limite: limite.toString()
      });
      
      const response = await fetch(`${API_BASE_URL}/produtos?${queryParams}`);
      const data = await response.json();
      
      if (!data.sucesso) {
        throw new Error(data.mensagem || 'Erro ao buscar produtos');
      }
      
      // Filtrar localmente por busca e categoria (idealmente seria no backend)
      let produtos = data.dados || [];
      
      if (busca) {
        produtos = produtos.filter(p => 
          p.nome.toLowerCase().includes(busca.toLowerCase()) ||
          (p.descricao && p.descricao.toLowerCase().includes(busca.toLowerCase()))
        );
      }
      
      if (categoria && categoria !== 'todas') {
        produtos = produtos.filter(p => p.categoria === categoria);
      }
      
      return {
        produtos,
        paginacao: data.paginacao
      };
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  };

  const fetchProductById = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/produtos/${id}`);
      const data = await response.json();
      
      if (!data.sucesso) {
        throw new Error(data.mensagem || 'Erro ao buscar produto');
      }
      
      return data.dados;
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      throw error;
    }
  };

  return { fetchProducts, fetchProductById };
};

// Página Index / Home
const HomePage = ({ onNavigate }) => {
  const [produtos, setProdutos] = useState([]);
  const [destaques, setDestaques] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchProducts } = useAPI();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const { produtos: produtosData } = await fetchProducts({ limite: 8 });
      setProdutos(produtosData);
      setDestaques(produtosData.slice(0, 3));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    onNavigate('catalogo', { busca });
  };

  const categorias = ['Eletrônicos', 'Mecânicos', 'Hidráulicos', 'Pneumáticos'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">CatálogoPRO</h1>
            </div>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <ShoppingCart className="w-5 h-5" />
              <span>Carrinho (0)</span>
            </button>
          </div>
          
          {/* Barra de Busca */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por código, nome ou descrição..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button 
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Buscar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtros por Categoria */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Categorias Principais</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => onNavigate('catalogo', { categoria })}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 text-center"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{categoria}</h3>
              </button>
            ))}
          </div>
        </section>

        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && (
          <>
            {/* Produtos em Destaque */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Star className="w-6 h-6 text-yellow-500 mr-2" />
                  Produtos em Destaque
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {destaques.map((produto) => (
                  <div
                    key={produto.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => onNavigate('produto', { id: produto.id })}
                  >
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                      {produto.imagem ? (
                        <img src={`${API_BASE_URL}/uploads/imagens/${produto.imagem}`} alt={produto.nome} className="h-full w-full object-cover" />
                      ) : (
                        <Package className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {produto.categoria || 'Geral'}
                      </span>
                      <h3 className="font-bold text-lg text-gray-900 mt-2 mb-1">{produto.nome}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {produto.descricao || 'Sem descrição disponível'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">
                          R$ {parseFloat(produto.preco).toFixed(2)}
                        </span>
                        <span className="text-sm text-green-600 font-medium">Em estoque</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Novidades */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <TrendingUp className="w-6 h-6 text-green-500 mr-2" />
                  Produtos Recentes
                </h2>
                <button 
                  onClick={() => onNavigate('catalogo')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Ver todos →
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {produtos.slice(3).map((produto) => (
                  <div
                    key={produto.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onNavigate('produto', { id: produto.id })}
                  >
                    <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                      {produto.imagem ? (
                        <img src={`${API_BASE_URL}/uploads/imagens/${produto.imagem}`} alt={produto.nome} className="h-full w-full object-cover" />
                      ) : (
                        <Package className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-1">{produto.nome}</h3>
                      <span className="text-lg font-bold text-blue-600">
                        R$ {parseFloat(produto.preco).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

// Página de Catálogo
const CatalogoPage = ({ onNavigate, initialFilters = {} }) => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginacao, setPaginacao] = useState(null);
  const [busca, setBusca] = useState(initialFilters.busca || '');
  const [categoria, setCategoria] = useState(initialFilters.categoria || 'todas');
  const [ordenacao, setOrdenacao] = useState('recentes');
  const [visualizacao, setVisualizacao] = useState('grid');
  const [paginaAtual, setPaginaAtual] = useState(1);
  
  const { fetchProducts } = useAPI();

  useEffect(() => {
    loadProducts();
  }, [paginaAtual, categoria, ordenacao]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { produtos: produtosData, paginacao: paginacaoData } = await fetchProducts({
        pagina: paginaAtual,
        limite: 12,
        busca,
        categoria
      });
      
      // Ordenar produtos localmente
      let produtosOrdenados = [...produtosData];
      if (ordenacao === 'preco-asc') {
        produtosOrdenados.sort((a, b) => parseFloat(a.preco) - parseFloat(b.preco));
      } else if (ordenacao === 'preco-desc') {
        produtosOrdenados.sort((a, b) => parseFloat(b.preco) - parseFloat(a.preco));
      } else if (ordenacao === 'nome') {
        produtosOrdenados.sort((a, b) => a.nome.localeCompare(b.nome));
      }
      
      setProdutos(produtosOrdenados);
      setPaginacao(paginacaoData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPaginaAtual(1);
    loadProducts();
  };

  const categorias = ['todas', 'Eletrônicos', 'Mecânicos', 'Hidráulicos', 'Pneumáticos'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <Package className="w-8 h-8" />
              <h1 className="text-2xl font-bold">CatálogoPRO</h1>
            </button>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <ShoppingCart className="w-5 h-5" />
              <span>Carrinho (0)</span>
            </button>
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button 
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Buscar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Filtros e Controles */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Filtro de Categoria */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'todas' ? 'Todas as Categorias' : cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* Ordenação */}
              <div className="relative">
                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white pr-8"
                >
                  <option value="recentes">Mais Recentes</option>
                  <option value="nome">Nome A-Z</option>
                  <option value="preco-asc">Menor Preço</option>
                  <option value="preco-desc">Maior Preço</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Visualização */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVisualizacao('grid')}
                className={`p-2 rounded ${visualizacao === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setVisualizacao('list')}
                className={`p-2 rounded ${visualizacao === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && (
          <>
            {/* Contador de Resultados */}
            <div className="mb-4">
              <p className="text-gray-600">
                {paginacao && `Mostrando ${produtos.length} de ${paginacao.total} produtos`}
              </p>
            </div>

            {/* Lista de Produtos */}
            <div className={visualizacao === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6' 
              : 'space-y-4'
            }>
              {produtos.map((produto) => (
                visualizacao === 'grid' ? (
                  <div
                    key={produto.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onNavigate('produto', { id: produto.id })}
                  >
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                      {produto.imagem ? (
                        <img src={`${API_BASE_URL}/uploads/imagens/${produto.imagem}`} alt={produto.nome} className="h-full w-full object-cover" />
                      ) : (
                        <Package className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {produto.categoria || 'Geral'}
                      </span>
                      <h3 className="font-bold text-gray-900 mt-2 mb-1 line-clamp-2">{produto.nome}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {produto.descricao || 'Sem descrição'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-blue-600">
                          R$ {parseFloat(produto.preco).toFixed(2)}
                        </span>
                        <span className="text-xs text-green-600 font-medium">Disponível</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    key={produto.id}
                    className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer flex gap-4"
                    onClick={() => onNavigate('produto', { id: produto.id })}
                  >
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center rounded-lg flex-shrink-0">
                      {produto.imagem ? (
                        <img src={`${API_BASE_URL}/uploads/imagens/${produto.imagem}`} alt={produto.nome} className="h-full w-full object-cover rounded-lg" />
                      ) : (
                        <Package className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {produto.categoria || 'Geral'}
                          </span>
                          <h3 className="font-bold text-lg text-gray-900 mt-2">{produto.nome}</h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {produto.descricao || 'Sem descrição disponível'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-blue-600 block">
                            R$ {parseFloat(produto.preco).toFixed(2)}
                          </span>
                          <span className="text-sm text-green-600 font-medium">Em estoque</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Paginação */}
            {paginacao && paginacao.totalPaginas > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
                  disabled={paginaAtual === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                {[...Array(paginacao.totalPaginas)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPaginaAtual(i + 1)}
                    className={`px-4 py-2 border rounded-lg ${
                      paginaAtual === i + 1
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setPaginaAtual(Math.min(paginacao.totalPaginas, paginaAtual + 1))}
                  disabled={paginaAtual === paginacao.totalPaginas}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

// Página do Produto
const ProdutoPage = ({ onNavigate, produtoId }) => {
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const { fetchProductById } = useAPI();

  useEffect(() => {
    loadProduct();
  }, [produtoId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const produtoData = await fetchProductById(produtoId);
      setProduto(produtoData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calcularPrecoTotal = () => {
    if (!produto) return 0;
    return (parseFloat(produto.preco) * quantidade).toFixed(2);
  };

  const tabelaPrecos = [
    { qtd: '1-10', desconto: '0%', preco: produto?.preco },
    { qtd: '11-50', desconto: '5%', preco: produto ? (produto.preco * 0.95).toFixed(2) : 0 },
    { qtd: '51-100', desconto: '10%', preco: produto ? (produto.preco * 0.90).toFixed(2) : 0 },
    { qtd: '100+', desconto: '15%', preco: produto ? (produto.preco * 0.85).toFixed(2) : 0 },
  ];

  if (loading) return <div className="min-h-screen bg-gray-50"><Loading /></div>;
  if (error) return <div className="min-h-screen bg-gray-50 p-8"><ErrorMessage message={error} /></div>;
  if (!produto) return <div className="min-h-screen bg-gray-50 p-8"><ErrorMessage message="Produto não encontrado" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => onNavigate('catalogo')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <Package className="w-8 h-8" />
              <h1 className="text-2xl font-bold">CatálogoPRO</h1>
            </button>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <ShoppingCart className="w-5 h-5" />
              <span>Carrinho (0)</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <button onClick={() => onNavigate('home')} className="hover:text-blue-600">Início</button>
          <span className="mx-2">/</span>
          <button onClick={() => onNavigate('catalogo')} className="hover:text-blue-600">Catálogo</button>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{produto.nome}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Imagens do Produto */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg flex items-center justify-center mb-4">
              {produto.imagem ? (
                <img 
                  src={`${API_BASE_URL}/uploads/imagens/${produto.imagem}`} 
                  alt={produto.nome} 
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Package className="w-32 h-32 text-gray-400" />
              )}
            </div>
          </div>

          {/* Informações do Produto */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded">
              {produto.categoria || 'Geral'}
            </span>
            
            <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">{produto.nome}</h1>
            <p className="text-gray-600 mb-4">Código: #{produto.id}</p>
            
            <div className="border-t border-b border-gray-200 py-4 mb-4">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-blue-600">
                  R$ {parseFloat(produto.preco).toFixed(2)}
                </span>
                <span className="text-gray-500">/ unidade</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ● Em estoque
                </span>
                <span className="text-gray-600 text-sm">Disponível para entrega imediata</span>
              </div>
            </div>

            {/* Descrição */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
              <p className="text-gray-600">
                {produto.descricao || 'Produto de alta qualidade para uso industrial e comercial. Fabricado com materiais duráveis e certificado conforme normas técnicas vigentes.'}
              </p>
            </div>

            {/* Especificações Técnicas */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Especificações Técnicas</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-gray-600">Categoria:</span>
                  <span className="font-medium text-gray-900 ml-2">{produto.categoria || 'Geral'}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-gray-600">Código:</span>
                  <span className="font-medium text-gray-900 ml-2">#{produto.id}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-gray-600">Fornecedor:</span>
                  <span className="font-medium text-gray-900 ml-2">Nacional</span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-gray-600">Garantia:</span>
                  <span className="font-medium text-gray-900 ml-2">12 meses</span>
                </div>
              </div>
            </div>

            {/* Seletor de Quantidade */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Quantidade
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center border border-gray-300 rounded-lg py-2 font-medium"
                  min="1"
                />
                <button
                  onClick={() => setQuantidade(quantidade + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 font-bold"
                >
                  +
                </button>
                <div className="ml-auto text-right">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">R$ {calcularPrecoTotal()}</p>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3">
              <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Adicionar ao Carrinho
              </button>
              <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium">
                Solicitar Cotação
              </button>
            </div>
          </div>
        </div>

        {/* Tabela de Preços por Quantidade */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Preços por Quantidade</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Quantidade</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Desconto</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Preço por Unidade</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Economia</th>
                </tr>
              </thead>
              <tbody>
                {tabelaPrecos.map((faixa, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{faixa.qtd} unidades</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                        faixa.desconto === '0%' ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-800'
                      }`}>
                        {faixa.desconto}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-blue-600">
                      R$ {parseFloat(faixa.preco).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {faixa.desconto !== '0%' && (
                        <span className="text-green-600 font-medium">
                          Economize {faixa.desconto}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>💡 Dica:</strong> Quanto maior a quantidade, maior o desconto! Entre em contato para pedidos acima de 100 unidades.
            </p>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Entrega Rápida</h3>
            <p className="text-sm text-gray-600">
              Produtos em estoque com entrega em até 5 dias úteis para todo o Brasil.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Compra Segura</h3>
            <p className="text-sm text-gray-600">
              Pagamento 100% seguro com certificado SSL e diversos métodos de pagamento.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Suporte Técnico</h3>
            <p className="text-sm text-gray-600">
              Equipe especializada pronta para tirar suas dúvidas e dar suporte técnico.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

// App Principal
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState({});

  const navigate = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {currentPage === 'home' && <HomePage onNavigate={navigate} />}
      {currentPage === 'catalogo' && <CatalogoPage onNavigate={navigate} initialFilters={pageParams} />}
      {currentPage === 'produto' && <ProdutoPage onNavigate={navigate} produtoId={pageParams.id} />}
    </div>
  );
}