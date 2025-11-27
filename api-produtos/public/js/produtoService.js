window.ProdutoService = {

    // Método para listar todos os produtos
    async listar() {
        // GET
        const r = await fetch('api/produtos');
        return r.json();
    },

    // Método para buscar um produto específico pelo ID
    async buscar(id) {
        // GET com ID do produto
        const r = await fetch(`api/produtos/${id}`);
        const resposta = await r.json();

        if (!r.ok || !resposta.sucesso) {
            throw new Error(resposta.mensagem || 'Erro ao buscar produto');
        }

        return resposta.dados;
    }
};
