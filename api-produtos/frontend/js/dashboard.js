async function carregarDashboard() {
  const res = await fetch("http://localhost:3000/dashboard", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });

  const json = await res.json();
  const d = json.dados;

  const cards = [
    { titulo: "Produtos", valor: d.totalProdutos },
    { titulo: "Categorias", valor: d.totalCategorias },
    { titulo: "Usuários", valor: d.totalUsuarios },
    { titulo: "Pedidos", valor: d.totalPedidos }
  ];

  document.getElementById("cardsResumo").innerHTML =
    cards.map(c => `
      <div class="col-3">
        <div class="card text-center p-3">
          <h4>${c.titulo}</h4>
          <p>${c.valor}</p>
        </div>
      </div>
    `).join("");

  document.getElementById("tabelaMaisVendidos").innerHTML =
    d.maisVendidos.map(p => `
      <tr>
        <td>${p.nome}</td>
        <td>${p.vendidos}</td>
      </tr>
    `).join("");

  document.getElementById("listaEstoqueBaixo").innerHTML =
    d.estoqueBaixo.map(p => `
      <li>${p.nome} (Estoque: ${p.estoque})</li>
    `).join("");
}

carregarDashboard();
