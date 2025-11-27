const API_URL = "/produtos";

window.ProdutoService = {

    // Método para listar todos os produtos
    async listar() {
        // GET
        const r = await fetch(API_URL);
        return r.json();
    },

    // Método para buscar um produto específico pelo ID
    async buscar(id) {
        // GET com ID do produto
        const r = await fetch(`${API_URL}/${id}`);
        return r.json();
    }
};
