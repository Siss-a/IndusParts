const botoes = document.querySelectorAll("nav button");
const conteudos = document.querySelectorAll(".conteudo");

botoes.forEach((botao) => {
  botao.addEventListener("click", () => {
    botoes.forEach((b) => b.classList.remove("ativo"));
    conteudos.forEach((c) => c.classList.remove("ativo"));

    botao.classList.add("ativo");
    document.getElementById(botao.dataset.alvo).classList.add("ativo");
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

    /* MASCARAS */
    const cnpjInput = document.getElementById('cnpjEmpresa');
    const telefoneInput = document.getElementById('telefoneEmpresa');
    // Máscara para CNPJ (XX.XXX.XXX/XXXX-XX)
    Inputmask('99.999.999/9999-99').mask(cnpjInput);

    // Máscara para Telefone (XX) XXXXX-XXXX
    Inputmask('+99 (99) 9999-9999').mask(telefoneInput);
  } catch (error) {
    console.error("Erro ao carregar dados do usuário:", error);
  }
});

const btn = document.getElementById("appsBtn");
    const menu = document.querySelector(".apps-menu");

    btn.onclick = (e) => {
      e.preventDefault();
      menu.classList.toggle("show");
    };

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".apps-container")) {
        menu.classList.remove("show");
      }
    });
