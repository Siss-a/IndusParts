const form = document.getElementById('loginForm');
form.addEventListener('submit', async (r) => {
    r.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha_hash').value;

    if (!email || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const res = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
    })
})