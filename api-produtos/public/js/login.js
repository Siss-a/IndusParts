const form = document.getElementById('loginForm');
const emailInput = document.getElementById('emailLogin');
const senhaInput = document.getElementById('senhaLogin');
const senhaError = document.getElementById('senhaError');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    // limpa erro anterior
    senhaError.classList.add('d-none');
    senhaError.textContent = '';

    if (!email || !senha) {
        senhaError.textContent = "Preencha todos os campos!";
        senhaError.classList.remove('d-none');
        return;
    }

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const dados = await res.json();

        if (res.ok) {
            localStorage.setItem('token', dados.dados.token);
            window.location.href = "/";
        } else {
            // mostra mensagem de erro do backend logo abaixo do input de senha
            senhaError.textContent = dados.mensagem || "Email ou senha incorretos";
            senhaError.classList.remove('d-none');
        }
    } catch (err) {
        senhaError.textContent = "Erro de conexão com o servidor";
        senhaError.classList.remove('d-none');
    }
});
