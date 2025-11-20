const form = document.getElementById('cadastroForm');
form.addEventListener('submit', async (r) => {
    r.preventDefault(); /* Previnir reload da pagina depois do submit */

    const usuario = document.getElementById('nome_social').value;
    const senha = document.getElementById('senha_hash').value;
    const email = document.getElementById('email').value;

    const res = await fetch('/api/usuarios/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario, senha, email })
    });
});  