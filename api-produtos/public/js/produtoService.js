window.ProdutoService = {

    // Método para listar todos os produtos
    async listar() {
        // GET
        const r = await fetch('/api/admin/produtos');
        return r.json();
    },

    // Método para buscar um produto específico pelo ID
    async buscar(id) {
        // GET com ID do produto
        const r = await fetch(`/api/admin/produtos/${id}`);
        return r.json();
    }
};
