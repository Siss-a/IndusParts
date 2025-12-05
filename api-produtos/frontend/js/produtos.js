
//lista produtos
async function listarProdutos() {
  const res = await fetch("http://localhost:3000/produtos");
  const data = await res.json();
  console.log(data.dados);
}

//criar um produto
async function criarProdutoComImagem() {
  const form = new FormData();
  form.append("nome", "Parafuso");
  form.append("preco", "19.90");
  form.append("descricao", "Parafuso com imagem");
  form.append("id_categoria", "1");
  form.append("fornecedor", "IndusParts");
  form.append("tipo", "Fixação");
  form.append("especificacoes", "Aço carbono");
  form.append("ativo", "true");
  form.append("imagem", document.querySelector("#inputImagem").files[0]);

  const res = await fetch("http://localhost:3000/produtos", {
    method: "POST",
    body: form
  });

  const data = await res.json();
  console.log(data);
}

//atualizar
async function atualizarProduto(id) {
  const atual = {
    nome: "Parafuso atualizado",
    preco: 15.33
  };

  const res = await fetch(`http://localhost:3000/produtos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(atual)
  });

  const data = await res.json();
  console.log(data);
}

//excluir
async function excluirProduto(id) {
  const res = await fetch(`http://localhost:3000/produtos/${id}`, {
    method: "DELETE"
  });

  const data = await res.json();
  console.log(data);
}

//buscar por nome
async function buscarPorNome(valor) {
  const res = await fetch(`http://localhost:3000/produtos/buscar/nome?valor=${valor}`);
  const data = await res.json();
  console.log(data.dados);
}

//buscar por categoria
async function buscarPorCategoria(cat) {
  const res = await fetch(`http://localhost:3000/produtos/buscar/categoria?valor=${cat}`);
  const data = await res.json();
  console.log(data.dados);
}

// <button onclick="adicionarItem(1, 1)">Adicionar Item</button>

// <script>
// async function adicionarItem(produtoId, quantidade) {
//   try {
//     const resposta = await fetch("http://localhost:3000/carrinho/adicionar", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ produtoId, quantidade })
//     });

//     const dados = await resposta.json();
//     console.log(dados);
//   } catch (erro) {
//     console.error("Erro ao adicionar item:", erro);
//   }
// }
// </script>



