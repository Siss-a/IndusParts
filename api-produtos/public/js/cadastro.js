const form = document.getElementById('cadastroForm');

/* Enviando dados para o backend */
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usuario = document.getElementById('nome_social').value;
    const senha = document.getElementById('senhaCadastro').value;
    const email = document.getElementById('emailCadastro').value;
    const cnpj = document.getElementById('cnpj').value;
    const telefone = document.getElementById('telefone').value;

    const res = await fetch('/api/auth/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome_social: usuario,
            senha: senha,
            email: email,
            cnpj: cnpj,
            telefone: telefone
        })
    });

    const dados = await res.json();

    if (res.ok) {
        mostrarAlerta(dados.mensagem || "Usuário registrado com sucesso!", "success");

        setTimeout(() => {
            window.location.href = "/dashboard";
        }, 1500);

    } else {
        mostrarAlerta(dados.mensagem || dados.erro || "Erro desconhecido ao registrar usuário.", "danger");
    }
});

/* Função de alerta */
function mostrarAlerta(mensagem, tipo = "success") {
    const container = document.getElementById("alertContainer");

    container.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show mt-3" role="alert">
            ${mensagem}
        </div>
    `; /* pega mensagem que está em AuthController */

    // Sair sozinho após 4 segundos
    setTimeout(() => {
        container.innerHTML = "";
    }, 4000);
}


/* Máscara de CNPJ */
document.getElementById('cnpj').addEventListener('input', function (e) {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 14) valor = valor.slice(0, 14);
    e.target.value = valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, (_, p1, p2, p3, p4, p5) => {
        return `${p1}.${p2}.${p3}/${p4}-${p5}`;
    });
});

/* Máscara de Telefone */
document.getElementById('telefone').addEventListener('input', function (e) {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.slice(0, 11);
    e.target.value = valor.replace(/(\d{2})(\d{1})(\d{4})(\d{0,4})/, (_, p1, p2, p3, p4) => {
        return `(${p1}) ${p2}${p3}-${p4}`;
    });
});
