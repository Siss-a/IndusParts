/* 
============================================
ARQUIVO: data.js
DESCRIÇÃO: Banco de dados simulado com produtos
Em um sistema real, estes dados viriam de uma API/Banco de Dados
============================================
*/

// Array com todos os produtos da loja
const produtos = [
    {
        id: 1,
        nome: "Alicate Universal Profissional 8\"",
        descricao: "Alicate universal de alta qualidade com cabo ergonômico",
        preco: 523.99,
        precoAntigo: 699.99,
        categoria: "alicates",
        marca: "tramontina",
        estoque: 45,
        avaliacao: 4.5,
        numAvaliacoes: 248,
        imagem: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400"
    },
    {
        id: 2,
        nome: "Alicate de Corte Diagonal 6\"",
        descricao: "Ideal para cortes precisos em fios e cabos",
        preco: 398.90,
        precoAntigo: null,
        categoria: "alicates",
        marca: "tramontina",
        estoque: 32,
        avaliacao: 4.8,
        numAvaliacoes: 203,
        imagem: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400"
    },
    {
        id: 3,
        nome: "Alicate Bico Longo 6\" Profissional",
        descricao: "Perfeito para trabalhos de precisão em eletrônica",
        preco: 445.50,
        precoAntigo: 550.00,
        categoria: "alicates",
        marca: "stanley",
        estoque: 28,
        avaliacao: 4.6,
        numAvaliacoes: 167,
        imagem: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400"
    },
    {
        id: 4,
        nome: "Chave de Fenda Profissional 6\"",
        descricao: "Chave de fenda com ponta magnética e cabo antiderrapante",
        preco: 45.90,
        precoAntigo: null,
        categoria: "chaves",
        marca: "stanley",
        estoque: 120,
        avaliacao: 4.3,
        numAvaliacoes: 324,
        imagem: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400"
    },
    {
        id: 5,
        nome: "Kit Chaves Allen 9 Peças",
        descricao: "Conjunto completo de chaves allen métricas",
        preco: 89.90,
        precoAntigo: 129.90,
        categoria: "chaves",
        marca: "tramontina",
        estoque: 65,
        avaliacao: 5.0,
        numAvaliacoes: 189,
        imagem: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400"
    },
    {
        id: 6,
        nome: "Furadeira de Impacto 850W",
        descricao: "Furadeira potente com função de impacto para alvenaria",
        preco: 456.90,
        precoAntigo: 599.90,
        categoria: "ferramentas",
        marca: "bosch",
        estoque: 15,
        avaliacao: 4.7,
        numAvaliacoes: 412,
        imagem: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400"
    },
    {
        id: 7,
        nome: "Parafusadeira Sem Fio 12V",
        descricao: "Parafusadeira compacta com bateria de lítio",
        preco: 389.90,
        precoAntigo: null,
        categoria: "ferramentas",
        marca: "dewalt",
        estoque: 22,
        avaliacao: 4.9,
        numAvaliacoes: 567,
        imagem: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400"
    },
    {
        id: 8,
        nome: "Esmerilhadeira Angular 4.1/2\" 850W",
        descricao: "Esmerilhadeira profissional com empunhadura lateral",
        preco: 278.90,
        precoAntigo: 350.00,
        categoria: "ferramentas",
        marca: "bosch",
        estoque: 18,
        avaliacao: 4.6,
        numAvaliacoes: 289,
        imagem: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400"
    },
    {
        id: 9,
        nome: "Trena Metálica 5m com Trava",
        descricao: "Trena resistente com fita de aço temperado",
        preco: 32.50,
        precoAntigo: null,
        categoria: "medicao",
        marca: "stanley",
        estoque: 200,
        avaliacao: 4.4,
        numAvaliacoes: 756,
        imagem: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400"
    },
    {
        id: 10,
        nome: "Nível a Laser Profissional",
        descricao: "Nível a laser com precisão de 0.3mm/m",
        preco: 789.90,
        precoAntigo: 999.90,
        categoria: "medicao",
        marca: "bosch",
        estoque: 12,
        avaliacao: 5.0,
        numAvaliacoes: 145,
        imagem: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400"
    },
    {
        id: 11,
        nome: "Trena a Laser 40m",
        descricao: "Medidor a laser com função de área e volume",
        preco: 356.90,
        precoAntigo: 450.00,
        categoria: "medicao",
        marca: "bosch",
        estoque: 25,
        avaliacao: 4.8,
        numAvaliacoes: 234,
        imagem: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400"
    },
    {
        id: 12,
        nome: "Kit 5 Alicates Profissionais",
        descricao: "Kit completo com alicates universal, corte, pressão, bico e bomba d'água",
        preco: 1899.90,
        precoAntigo: 2499.90,
        categoria: "alicates",
        marca: "tramontina",
        estoque: 8,
        avaliacao: 5.0,
        numAvaliacoes: 412,
        imagem: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400"
    },
    {
        id: 13,
        nome: "Serra Tico-Tico 450W",
        descricao: "Serra tico-tico com regulagem de velocidade",
        preco: 312.90,
        precoAntigo: null,
        categoria: "ferramentas",
        marca: "dewalt",
        estoque: 19,
        avaliacao: 4.5,
        numAvaliacoes: 178,
        imagem: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400"
    },
    {
        id: 14,
        nome: "Chave Inglesa 12\" Ajustável",
        descricao: "Chave inglesa profissional com abertura de 32mm",
        preco: 78.90,
        precoAntigo: 95.00,
        categoria: "chaves",
        marca: "stanley",
        estoque: 88,
        avaliacao: 4.7,
        numAvaliacoes: 267,
        imagem: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400"
    },
    {
        id: 15,
        nome: "Paquímetro Digital 150mm",
        descricao: "Paquímetro digital em aço inox com precisão de 0.01mm",
        preco: 156.90,
        precoAntigo: 200.00,
        categoria: "medicao",
        marca: "stanley",
        estoque: 35,
        avaliacao: 4.9,
        numAvaliacoes: 298,
        imagem: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400"
    }
];

// Exportar os dados para uso no app.js
// (Em ambiente de módulos ES6, usaríamos: export default produtos;)