async function cadastrarProduto() {
  await fetch("http://localhost:3000/produtos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: document.getElementById("nome").value,
      preco: document.getElementById("preco").value
    })
  });

  listarProdutos();
}

async function listarProdutos() {
  const resp = await fetch("http://localhost:3000/produtos");
  const lista = await resp.json();

  const ul = document.getElementById("lista");
  ul.innerHTML = "";

  lista.forEach(prod => {
    const li = document.createElement("li");
    li.textContent = `${prod.nome} - R$ ${prod.preco}`;
    ul.appendChild(li);
  });
}

listarProdutos();
