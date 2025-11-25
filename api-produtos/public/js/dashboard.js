const botoes = document.querySelectorAll("nav button");
const conteudos = document.querySelectorAll(".conteudo");

botoes.forEach(botao => {
    botao.addEventListener("click", () => {
        botoes.forEach(b => b.classList.remove("ativo"));
        conteudos.forEach(c => c.classList.remove("ativo"));

        botao.classList.add("ativo");
        document.getElementById(botao.dataset.alvo).classList.add("ativo");

        // SALVA A ABA ATUAL
        localStorage.setItem("aba_atual", botao.dataset.alvo);
    });
});

//  RESTAURA A ABA ANTERIOR
window.addEventListener("load", () => {
    const abaSalva = localStorage.getItem("aba_atual");

    if (abaSalva) {
        // Remove ativo de tudo
        document.querySelectorAll("nav button").forEach(b => b.classList.remove("ativo"));
        document.querySelectorAll(".conteudo").forEach(c => c.classList.remove("ativo"));

        // Ativa a aba salva
        document.querySelector(`nav button[data-alvo="${abaSalva}"]`).classList.add("ativo");
        document.getElementById(abaSalva).classList.add("ativo");
    }
});

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

/* Integração para o backend */
/* window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    // Se não tem token, redireciona para login
    if (!token) {
        alert('Você precisa fazer login primeiro!');
        window.location.href = '/login.html';
        return;
    }

    // Se tem token, tenta buscar dados
    try {
        const res = await fetch('/api/auth/perfil', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // ← Envia o token
                'Content-Type': 'application/json'
            }
        });

        // Se o token está inválido/expirado (401)
        if (res.status === 401) {
            alert('Sessão expirada. Faça login novamente.');
            localStorage.removeItem('token');
            window.location.href = '/login.html';
            return;
        }

        if (!res.ok) {
            throw new Error('Erro ao carregar dados');
        }

        const resultado = await res.json();
        const usuario = resultado.dados;

        // Atualiza a página com os dados
        document.getElementById('nomeUsuarioInicio').textContent = usuario.nome_social;
        document.getElementById('emailUsuario').textContent = usuario.email;
        document.getElementById('telefoneUsuario').textContent = usuario.telefone;
        document.getElementById('cnpjUsuario').textContent = usuario.cnpj;

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar dados do usuário.');
    }
}); */