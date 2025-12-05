window.ProdutoService = {

    // Método para listar todos os produtos
    // Método para listar todos os produtos
async listar() {
    try {
        const r = await fetch('http://localhost:3000/api/produtos');
        const data = await r.json();

        // 🎯 CORREÇÃO: Verifica se a resposta HTTP foi bem-sucedida (status 200-299)
        if (!r.ok) {
            console.error("Erro da API:", data.erro || "Falha na requisição de produtos");
            // Se a requisição falhar, retornamos um array vazio para não quebrar o frontend
            return []; 
        }
        
        // CORREÇÃO: Garante que o campo 'dados' é retornado. 
        // Se 'data.dados' não for um array (embora deva ser), retorna um array vazio.
        return Array.isArray(data.dados) ? data.dados : [];

    } catch (error) {
        console.error("Erro ao listar produtos (Falha de rede/JSON):", error);
        // Em caso de erro de rede ou JSON (o catch), retornamos um array vazio
        return []; 
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