/* function irParaPaginaProtegida() {
        const token = localStorage.getItem("token");
        if (token) {
            window.location.href = "/perfil";   // se estiver logado
        } else {
            window.location.href = "/login";    // se NÃO estiver logado
        }
    }

    // Adiciona o evento para cada botão
    document.getElementById("btnCarrinhoMobile")?.addEventListener("click", irParaPaginaProtegida);
    document.getElementById("btnContaMobile")?.addEventListener("click", irParaPaginaProtegida);
    document.getElementById("btnCarrinhoDesk")?.addEventListener("click", irParaPaginaProtegida);
    document.getElementById("btnContaDesk")?.addEventListener("click", irParaPaginaProtegida); */

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
document.getElementById("btnCarrinhoMobile")?.addEventListener("click", irParaCarrinho);
document.getElementById("btnCarrinhoDesk")?.addEventListener("click", irParaCarrinho);

// BOTÕES DA CONTA
document.getElementById("btnContaMobile")?.addEventListener("click", irParaPerfil);
document.getElementById("btnContaDesk")?.addEventListener("click", irParaPerfil);
