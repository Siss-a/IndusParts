const form = document.getElementById('loginForm');
form.addEventListener('submit', async (r) => {
    r.preventDefault();

    const email = document.getElementById('emailLogin').value;
    const senha = document.getElementById('senhaLogin').value;

    if (!email || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

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
        console.log(dados);
    }
})