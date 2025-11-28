window.ProdutoService = {

    // Método para listar todos os produtos
    async listar() {
        try {
            const r = await fetch('http://localhost:3000/api/produtos');
            const data = await r.json();
            
            // Retorna o array de produtos
            return data.dados || data;
        } catch (error) {
            console.error("Erro ao listar produtos:", error);
            throw error;
        }
    },

    // Método para buscar um produto específico pelo ID
    async buscar(id) {
        try {
            const r = await fetch(`http://localhost:3000/api/produtos/${id}`);
            const data = await r.json();
            
            if (!r.ok) {
                throw new Error(data.mensagem || "Erro ao buscar produto");
            }
            
            // Retorna os dados do produto
            return data.dados || data;
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
            throw error;
        }
    }
};