// Estado da aplicação
let produtos = [];
let paginaAtual = 1;
let totalPaginas = 1;
let produtoEditando = null;
let produtoParaExcluir = null;
const itensPorPagina = 10;

// Elementos do DOM
const loginModal = document.getElementById('login-modal');
const adminContent = document.getElementById('admin-content');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const btnLogout = document.getElementById('btn-logout');
const btnAdicionar = document.getElementById('btn-adicionar');
const formModal = document.getElementById('form-modal');
const confirmModal = document.getElementById('confirm-modal');
const produtoForm = document.getElementById('produto-form');
const produtosTbody = document.getElementById('produtos-tbody');
const paginacaoAdmin = document.getElementById('paginacao-admin');
const loadingElement = document.getElementById('loading');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    configurarEventos();
});

// Verificar autenticação
function verificarAutenticacao() {
    if (isAuthenticated()) {
        mostrarPainelAdmin();
        carregarProdutos();
    } else {
        mostrarLoginModal();
    }
}

// Configurar eventos
function configurarEventos() {
    loginForm.addEventListener('submit', handleLogin);
    btnLogout.addEventListener('click', handleLogout);
    btnAdicionar.addEventListener('click', () => abrirModal());
    produtoForm.addEventListener('submit', handleSubmitProduto);
    
    document.getElementById('close-modal').addEventListener('click', fecharModal);
    document.getElementById('btn-cancelar').addEventListener('click', fecharModal);
    
    document.getElementById('btn-cancelar-exclusao').addEventListener('click', fecharModalConfirmacao);
    document.getElementById('btn-confirmar-exclusao').addEventListener('click', confirmarExclusao);
    
    // Preview de imagem
    document.getElementById('imagem').addEventListener('change', handleImagemPreview);
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    
    try {
        loginError.style.display = 'none';
        
        const response = await apiRequest(API_CONFIG.ENDPOINTS.LOGIN, {
            method: 'POST',
            body: JSON.stringify({ email, senha })
        });
        
        if (response.sucesso && response.dados.token) {
            setToken(response.dados.token);
            loginModal.style.display = 'none';
            mostrarPainelAdmin();
            carregarProdutos();
            mostrarNotificacao('Login realizado com sucesso!', 'success');
        }
    } catch (error) {
        loginError.textContent = error.message || 'Erro ao fazer login. Verifique suas credenciais.';
        loginError.style.display = 'block';
    }
}

// Handle Logout
function handleLogout() {
    removeToken();
    window.location.reload();
}

// Mostrar modal de login
function mostrarLoginModal() {
    loginModal.style.display = 'flex';
    adminContent.style.display = 'none';
}

// Mostrar painel admin
function mostrarPainelAdmin() {
    loginModal.style.display = 'none';
    adminContent.style.display = 'block';
}

// Carregar produtos
async function carregarProdutos() {
    try {
        mostrarLoading(true);
        
        const response = await apiRequest(
            `${API_CONFIG.ENDPOINTS.PRODUTOS}?pagina=${paginaAtual}&limite=${itensPorPagina}`
        );
        
        if (response.sucesso) {
            produtos = response.dados;
            totalPaginas = response.paginacao.totalPaginas;
            renderizarTabelaProdutos();
            renderizarPaginacao();
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        mostrarNotificacao('Erro ao carregar produtos', 'error');
    } finally {
        mostrarLoading(false);
    }
}

// Renderizar tabela de produtos
function renderizarTabelaProdutos() {
    produtosTbody.innerHTML = '';
    
    if (produtos.length === 0) {
        produtosTbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem;">
                    Nenhum produto cadastrado
                </td>
            </tr>
        `;
        return;
    }
    
    produtos.forEach(produto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${produto.id}</td>
            <td>
                <img src="${getImageUrl(produto.imagem)}" 
                     alt="${produto.nome}" 
                     class="table-imagem"
                     onerror="this.src='https://via.placeholder.com/60x60?text=Sem+Imagem'">
            </td>
            <td>${produto.nome}</td>
            <td>${produto.categoria || 'Geral'}</td>
            <td>${formatarPreco(produto.preco)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-primary btn-small" onclick="editarProduto(${produto.id})">
                        Editar
                    </button>
                    <button class="btn btn-danger btn-small" onclick="abrirModalExclusao(${produto.id})">
                        Excluir
                    </button>
                </div>
            </td>
        `;
        produtosTbody.appendChild(tr);
    });
}

// Renderizar paginação
function renderizarPaginacao() {
    if (totalPaginas <= 1) {
        paginacaoAdmin.innerHTML = '';
        return;
    }
    
    paginacaoAdmin.innerHTML = '';
    
    // Botão anterior
    const btnAnterior = document.createElement('button');
    btnAnterior.textContent = '← Anterior';
    btnAnterior.disabled = paginaAtual === 1;
    btnAnterior.addEventListener('click', () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            carregarProdutos();
        }
    });
    paginacaoAdmin.appendChild(btnAnterior);
    
    // Páginas
    for (let i = 1; i <= totalPaginas; i++) {
        const btnPagina = document.createElement('button');
        btnPagina.textContent = i;
        btnPagina.className = i === paginaAtual ? 'active' : '';
        btnPagina.addEventListener('click', () => {
            paginaAtual = i;
            carregarProdutos();
        });
        paginacaoAdmin.appendChild(btnPagina);
    }
    
    // Botão próximo
    const btnProximo = document.createElement('button');
    btnProximo.textContent = 'Próximo →';
    btnProximo.disabled = paginaAtual === totalPaginas;
    btnProximo.addEventListener('click', () => {
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            carregarProdutos();
        }
    });
    paginacaoAdmin.appendChild(btnProximo);
}

// Abrir modal de formulário
function abrirModal(produto = null) {
    produtoEditando = produto;
    formModal.style.display = 'flex';
    
    if (produto) {
        document.getElementById('form-title').textContent = 'Editar Produto';
        document.getElementById('produto-id').value = produto.id;
        document.getElementById('nome').value = produto.nome;
        document.getElementById('descricao').value = produto.descricao || '';
        document.getElementById('preco').value = produto.preco;
        document.getElementById('categoria').value = produto.categoria || '';
        
        if (produto.imagem) {
            const previewContainer = document.getElementById('preview-container');
            const preview = document.getElementById('image-preview');
            preview.src = getImageUrl(produto.imagem);
            previewContainer.style.display = 'block';
        }
    } else {
        document.getElementById('form-title').textContent = 'Adicionar Produto';
        produtoForm.reset();
        document.getElementById('produto-id').value = '';
        document.getElementById('preview-container').style.display = 'none';
    }
    
    document.getElementById('form-error').style.display = 'none';
}

// Fechar modal
function fecharModal() {
    formModal.style.display = 'none';
    produtoForm.reset();
    produtoEditando = null;
    document.getElementById('preview-container').style.display = 'none';
}

// Editar produto
async function editarProduto(id) {
    try {
        const response = await apiRequest(`${API_CONFIG.ENDPOINTS.PRODUTOS}/${id}`);
        if (response.sucesso) {
            abrirModal(response.dados);
        }
    } catch (error) {
        mostrarNotificacao('Erro ao carregar produto', 'error');
    }
}

// Handle submit do formulário
async function handleSubmitProduto(e) {
    e.preventDefault();
    
    const formError = document.getElementById('form-error');
    formError.style.display = 'none';
    
    const id = document.getElementById('produto-id').value;
    const nome = document.getElementById('nome').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const preco = document.getElementById('preco').value;
    const categoria = document.getElementById('categoria').value.trim();
    const imagemInput = document.getElementById('imagem');
    
    try {
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('descricao', descricao);
        formData.append('preco', preco);
        formData.append('categoria', categoria);
        
        if (imagemInput.files[0]) {
            formData.append('imagem', imagemInput.files[0]);
        }
        
        let response;
        
        if (id) {
            // Atualizar produto existente
            response = await apiUpload(`${API_CONFIG.ENDPOINTS.PRODUTOS}/${id}?_method=PUT`, formData);
            mostrarNotificacao('Produto atualizado com sucesso!', 'success');
        } else {
            // Criar novo produto
            response = await apiUpload(API_CONFIG.ENDPOINTS.PRODUTOS, formData);
            mostrarNotificacao('Produto criado com sucesso!', 'success');
        }
        
        fecharModal();
        carregarProdutos();
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        formError.textContent = error.message || 'Erro ao salvar produto';
        formError.style.display = 'block';
    }
}

// Preview de imagem
function handleImagemPreview(e) {
    const file = e.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const preview = document.getElementById('image-preview');
            const previewContainer = document.getElementById('preview-container');
            preview.src = event.target.result;
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// Abrir modal de confirmação de exclusão
function abrirModalExclusao(id) {
    produtoParaExcluir = id;
    confirmModal.style.display = 'flex';
}

// Fechar modal de confirmação
function fecharModalConfirmacao() {
    confirmModal.style.display = 'none';
    produtoParaExcluir = null;
}

// Confirmar exclusão
async function confirmarExclusao() {
    if (!produtoParaExcluir) return;
    
    try {
        await apiRequest(`${API_CONFIG.ENDPOINTS.PRODUTOS}/${produtoParaExcluir}`, {
            method: 'DELETE'
        });
        
        mostrarNotificacao('Produto excluído com sucesso!', 'success');
        fecharModalConfirmacao();
        carregarProdutos();
    } catch (error) {
        mostrarNotificacao('Erro ao excluir produto', 'error');
    }
}

// Mostrar/ocultar loading
function mostrarLoading(mostrar) {
    loadingElement.style.display = mostrar ? 'flex' : 'none';
}

// Tornar funções globais
window.editarProduto = editarProduto;
window.abrirModalExclusao = abrirModalExclusao;