/* window.criarCardProduto = function(produto) {

     // Cria uma div que será o container do card
    const div = document.createElement("div");

    // Cria o elemento de imagem do produto
    const img = document.createElement("img");
    img.src = produto.imagem || "";
    img.width = 150;

    // Cria o título (nome do produto)
    const nome = document.createElement("h3");
    nome.textContent = produto.nome;

    // Cria o preço
    const preco = document.createElement("p");
    preco.textContent = "R$ " + produto.preco.toFixed(2);

    // Adiciona os elementos criados dentro da div
    div.appendChild(img);
    div.appendChild(nome);
    div.appendChild(preco);

    return div;
}; */

window.criarCardProduto = function(produto) {

    const div = document.createElement("div");

    // Corrigido: usa 'img' do backend
    const img = document.createElement("img");
    img.src = produto.img ? `http://localhost:3000/${produto.img}` : "";
    img.width = 150;

    const nome = document.createElement("h3");
    nome.textContent = produto.nome;

    const preco = document.createElement("p");
    preco.textContent = produto.preco ? "R$ " + produto.preco.toFixed(2) : "Sem preço";

    div.appendChild(img);
    div.appendChild(nome);
    div.appendChild(preco);

    return div;
};
