const form = document.getElementById('cadastroForm');
form.addEventListener('submit', async (r) => {
    r.preventDefault(); /* Previnir reload da pagina depois do submit */

    const usuario = document.getElementById('nome_social').value;
    const senha = document.getElementById('senhaCadastro').value;
    const email = document.getElementById('emailCadastro').value;
    const cnpj = document.getElementById('cnpj').value;
    const telefone = document.getElementById('telefone').value;

    const res = await fetch('/api/auth/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome_social: usuario,
            senha_hash: senha,
            email: email,
            cnpj: cnpj,
            telefone: telefone
        })
    });
});