function irParaCarrinho() {
  const token = localStorage.getItem("token");

  if (token) {
    window.location.href = "/carrinho"; // SE ESTIVER LOGADO → carrinho
  } else {
    window.location.href = "/login"; // SE NÃO → login
  }
}

function irParaPerfil() {
  const token = localStorage.getItem("token");

  if (token) {
    window.location.href = "/perfil"; // área do usuário
  } else {
    window.location.href = "/login"; // precisa logar
  }
}

// BOTÕES DO CARRINHO
document
  .getElementById("btnCarrinhoMobile")
  ?.addEventListener("click", irParaCarrinho);
document
  .getElementById("btnCarrinhoDesk")
  ?.addEventListener("click", irParaCarrinho);

// BOTÕES DA CONTA
document
  .getElementById("btnContaMobile")
  ?.addEventListener("click", irParaPerfil);
document
  .getElementById("btnContaDesk")
  ?.addEventListener("click", irParaPerfil);

window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("/api/usuarios/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });

    /*  if (res.status === 401) {
             localStorage.removeItem('token');
             window.location.href = '/login';
             return;
         } */

    const resposta = await res.json(); //transforma em objeto JavaScript
    const usuario = resposta.dados;

    document.getElementById("cnpjEmpresa").innerText = usuario.cnpj;
    document.getElementById("emailEmpresa").innerText = usuario.email;
    document.getElementById("telefoneEmpresa").innerText = usuario.telefone;
    document
      .querySelectorAll(".nome-empresa")
      .forEach((el) => (el.textContent = usuario.nome_social));
  } catch (error) {
    console.error("Erro ao carregar dados do usuário:", error);
  }
});
