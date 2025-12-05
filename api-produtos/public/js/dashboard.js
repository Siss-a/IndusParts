const botoes = document.querySelectorAll("nav button");
const conteudos = document.querySelectorAll(".conteudo");

botoes.forEach((botao) => {
  botao.addEventListener("click", () => {
    botoes.forEach((b) => b.classList.remove("ativo"));
    conteudos.forEach((c) => c.classList.remove("ativo"));

    botao.classList.add("ativo");
    document.getElementById(botao.dataset.alvo).classList.add("ativo");

    // SALVA A ABA ATUAL
    localStorage.setItem("aba_atual", botao.dataset.alvo);
  });
});

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

/* Carregar dados do usuário */
window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
        window.location.href = '/login';
        return;
    }

  try {
    const res = await fetch("/api/auth/perfil", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });

     if (res.status === 401) {
             localStorage.removeItem('token');
             window.location.href = '/login';
             return;
         }

    const resposta = await res.json(); //transforma em objeto JavaScript
    const usuario = resposta.dados;

    document.getElementById("cnpjEmpresa").innerText = usuario.cnpj;
    document.getElementById("emailEmpresa").innerText = usuario.email;
    document.getElementById("telefoneEmpresa").innerText = usuario.telefone;
    document.querySelectorAll(".nome-empresa").forEach((el) => (el.textContent = usuario.nome_social));
  } catch (error) {
    console.error("Erro ao carregar dados do usuário:", error);
  }
});
