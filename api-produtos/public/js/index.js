function irParaPaginaProtegida() {
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
    document.getElementById("btnContaDesk")?.addEventListener("click", irParaPaginaProtegida);