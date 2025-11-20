// catalogo-produtos.js
const API_BASE = "/"; // ajuste se sua API estiver em /api/produtos ou outro prefixo

function getToken() {
  return localStorage.getItem("token"); // adapte conforme seu armazenamento
}

function defaultHeaders() {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function fetchProdutos(pagina = 1, limite = 100) {
  const params = new URLSearchParams();
  params.set("pagina", String(pagina));
  params.set("limite", String(limite));
  const res = await fetch(`${API_BASE}?${params.toString()}`, {
    method: "GET",
    headers: defaultHeaders(),
    credentials: "same-origin"
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Erro ao buscar produtos: ${res.status} ${txt}`);
  }
  const body = await res.json();
  // corpo esperado: { sucesso: true, dados: [...], paginacao: {...} }
  return body.dados || body;
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // você pode parametrizar pagina/limite por querystring se desejar
    const produtos = await fetchProdutos(1, 100);

    if (!Array.isArray(produtos)) {
      console.warn("Formato de produtos inesperado:", produtos);
      return;
    }

    produtos.forEach(produto => {
      const id = produto.id || produto.id_produto || produto.produto_id;
      if (id === undefined || id === null) return;

      const img = document.getElementById(`img-${id}`);
      const titulo = document.getElementById(`titulo-${id}`);
      const desc = document.getElementById(`desc-${id}`);
      const card = document.getElementById(`card-${id}`);
      const preco = document.getElementById(`preco-${id}`);
      const pontos = document.getElementById(`pontos-${id}`);

      if (img) {
        // se imagem vier como caminho relativo no servidor, use-o diretamente
        img.src = produto.imagem ? produto.imagem : img.src;
      }
      if (titulo) titulo.textContent = produto.nome || produto.titulo || produto.nome_produto || "";
      if (desc) desc.textContent = produto.descricao || "";
      if (preco) preco.textContent = produto.preco !== undefined ? produto.preco : "";
      if (pontos) pontos.textContent = produto.pontos !== undefined ? produto.pontos : "";

      if (card) {
        card.onclick = () => {
          const nomeurl = produto.nomeurl || produto.slug || (produto.nome || produto.titulo || "").toLowerCase().replace(/\s+/g, '-');
          window.location.href = `produto.html?id=${id}&nome=${encodeURIComponent(nomeurl)}`;
        };
      }
    });
  } catch (error) {
    console.error("Erro ao carregar produtos da API:", error);
  }
});
