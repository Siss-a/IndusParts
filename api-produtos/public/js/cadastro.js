const form = document.getElementById('cadastroForm');
/* mandando informacoes (valores) para o backend */
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
            senha: senha,
            email: email,
            cnpj: cnpj,
            telefone: telefone
        })
    });
});

/* Máscaras */
// Máscara CNPJ
document.getElementById('cnpj').addEventListener('input', function (e) {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 14) valor = valor.slice(0, 14);
    e.target.value = valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, (_, p1, p2, p3, p4, p5) => {
        return `${p1}.${p2}.${p3}/${p4}-${p5}`;
    });
});

// Máscara Telefone
document.getElementById('telefone').addEventListener('input', function (e) {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.slice(0, 11);
    e.target.value = valor.replace(/(\d{2})(\d{5})(\d{0,4})/, (_, p1, p2, p3) => {
        return `(${p1}) ${p2}-${p3}`;
    });
});