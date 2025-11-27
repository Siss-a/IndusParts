// ====================================
// CADASTRAR PRODUTO
// ====================================
document
  .getElementById("formCadastro")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nome", document.getElementById("nome").value);
    formData.append("descricao", document.getElementById("descricao").value);
    formData.append("preco", document.getElementById("preco").value);
    formData.append(
      "id_categoria",
      document.getElementById("id_categoria").value
    );
    formData.append("fornecedor", document.getElementById("fornecedor").value);
    formData.append("tipo", document.getElementById("tipo").value);
    formData.append(
      "especificacoes",
      document.getElementById("especificacoes").value
    );

    const imagemInput = document.getElementById("imagem");
    if (imagemInput.files[0]) {
      formData.append("imagem", imagemInput.files[0]);
    }

    try {
      const response = await fetch('/api/produtos', {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.sucesso) {
        document.getElementById(
          "mensagemCadastro"
        ).innerHTML = `<p style="color: green;">${data.mensagem}</p>`;
        document.getElementById("formCadastro").reset();
        carregarProdutos();
      } else {
        document.getElementById(
          "mensagemCadastro"
        ).innerHTML = `<p style="color: red;">Erro: ${data.erro}</p>`;
      }
    } catch (error) {
      document.getElementById(
        "mensagemCadastro"
      ).innerHTML = `<p style="color: red;">Erro ao cadastrar: ${error.message}</p>`;
    }
  });

// ====================================
// CARREGAR PRODUTOS
// ====================================
async function carregarProdutos() {
  const pagina = document.getElementById("pagina").value;
  const limite = document.getElementById("limite").value;

  try {
    const response = await fetch(
      `${API_URL}/produtos?pagina=${pagina}&limite=${limite}`
    );
    const data = await response.json();

    if (data.sucesso) {
      exibirProdutos(data.dados);
      exibirPaginacao(data.paginacao);
    } else {
      document.getElementById(
        "listaProdutos"
      ).innerHTML = `<p style="color: red;">Erro: ${data.erro}</p>`;
    }
  } catch (error) {
    document.getElementById(
      "listaProdutos"
    ).innerHTML = `<p style="color: red;">Erro ao carregar produtos: ${error.message}</p>`;
  }
}

// ====================================
// EXIBIR PRODUTOS NA TELA
// ====================================
function exibirProdutos(produtos) {
  const container = document.getElementById("listaProdutos");

  if (produtos.length === 0) {
    container.innerHTML = "<p>Nenhum produto encontrado.</p>";
    return;
  }

  let html =
    '<table border="1"><thead><tr>' +
    "<th>ID</th><th>Nome</th><th>Preço</th><th>Fornecedor</th>" +
    "<th>Tipo</th><th>Imagem</th><th>Ações</th>" +
    "</tr></thead><tbody>";

  produtos.forEach((produto) => {
    html += `<tr>
                    <td>${produto.id}</td>
                    <td>${produto.nome}</td>
                    <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>
                    <td>${produto.fornecedor || "-"}</td>
                    <td>${produto.tipo || "-"}</td>
                    <td>${
                      produto.img
                        ? `<img src="http://localhost:3000/uploads/${produto.img}" width="50">`
                        : "-"
                    }</td>
                    <td>
                        <button onclick="editarProduto(${
                          produto.id
                        })">Editar</button>
                        <button onclick="excluirProduto(${
                          produto.id
                        })">Excluir</button>
                    </td>
                </tr>`;
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}

// ====================================
// EXIBIR INFO DE PAGINAÇÃO
// ====================================
function exibirPaginacao(paginacao) {
  const info = document.getElementById("infoPaginacao");
  info.innerHTML = `
                <p>Página ${paginacao.pagina} de ${paginacao.totalPaginas}
                (Total: ${paginacao.total} produtos)</p>
            `;
}

// ====================================
// EDITAR PRODUTO
// ====================================
async function editarProduto(id) {
  try {
    const response = await fetch(`${API_URL}/produtos/${id}`);
    const data = await response.json();

    if (data.sucesso) {
      const produto = data.dados;
      document.getElementById("edit_id").value = produto.id;
      document.getElementById("edit_nome").value = produto.nome;
      document.getElementById("edit_descricao").value = produto.descricao || "";
      document.getElementById("edit_preco").value = produto.preco;

      document.getElementById("secaoEdicao").style.display = "block";
      document
        .getElementById("secaoEdicao")
        .scrollIntoView({ behavior: "smooth" });
    }
  } catch (error) {
    alert("Erro ao carregar produto: " + error.message);
  }
}

// ====================================
// SALVAR EDIÇÃO
// ====================================
document.getElementById("formEdicao").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("edit_id").value;
  const formData = new FormData();

  formData.append("nome", document.getElementById("edit_nome").value);
  formData.append("descricao", document.getElementById("edit_descricao").value);
  formData.append("preco", document.getElementById("edit_preco").value);

  const imagemInput = document.getElementById("edit_imagem");
  if (imagemInput.files[0]) {
    formData.append("imagem", imagemInput.files[0]);
  }

  try {
    const response = await fetch(`/api/produtos/${id}`, {
      method: "PUT",
      body: formData,
    });

    const data = await response.json();

    if (data.sucesso) {
      document.getElementById(
        "mensagemEdicao"
      ).innerHTML = `<p style="color: green;">${data.mensagem}</p>`;
      setTimeout(() => {
        cancelarEdicao();
        carregarProdutos();
      }, 1500);
    } else {
      document.getElementById(
        "mensagemEdicao"
      ).innerHTML = `<p style="color: red;">Erro: ${data.erro}</p>`;
    }
  } catch (error) {
    document.getElementById(
      "mensagemEdicao"
    ).innerHTML = `<p style="color: red;">Erro ao atualizar: ${error.message}</p>`;
  }
});

// ====================================
// CANCELAR EDIÇÃO
// ====================================
function cancelarEdicao() {
  document.getElementById("secaoEdicao").style.display = "none";
  document.getElementById("formEdicao").reset();
  document.getElementById("mensagemEdicao").innerHTML = "";
}

// ====================================
// EXCLUIR PRODUTO
// ====================================
async function excluirProduto(id) {
  const botaoExcluir = document.querySelector(`#excluir-${id}`);
  if (!confirm("Tem certeza que deseja excluir este produto?")) {
    return;
  }

  // Desabilitar botão enquanto processa
  botaoExcluir.disabled = true;

  try {
    const response = await fetch(`${API_URL}/produtos/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (data.sucesso) {
      alert(data.mensagem);
      carregarProdutos();
    } else {
      alert("Erro: " + data.erro);
    }
  } catch (error) {
    alert("Erro ao excluir produto: " + error.message);
  } finally {
    // Reabilitar o botão após o processo
    botaoExcluir.disabled = false;
  }
}

// Carregar produtos ao abrir a página
window.onload = () => {
  carregarProdutos();
};
