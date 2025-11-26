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
            window.location.href = "/perfil";
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

    // Limita ao máximo internacional: E.164 (15 dígitos)
    if (valor.length > 15) valor = valor.slice(0, 15);

    let cc = "";   // codigo do país
    let dd = "";   // codigo da area
    let pre = "";   // prefixo
    let su = "";   // sufixo

    // Código do país (de 1 a 3 dígitos)
    if (valor.length >= 1) cc = valor.substring(0, 1);
    if (valor.length >= 2 && valor[0] !== "1") cc = valor.substring(0, 2); // países que não começam com 1 têm 2 dígitos
    if (valor.length >= 3 && valor[0] !== "1" && parseInt(valor.substring(0, 2)) > 55) cc = valor.substring(0, 3); // fallback para países exóticos

    let resto = valor.substring(cc.length);

    // Código de área (2–3 dígitos dependendo do país)
    if (resto.length >= 2) dd = resto.substring(0, 2);

    // Para EUA e Canadá (country code 1) o DDD tem 3 dígitos:
    if (cc === "1" && resto.length >= 3) {
        dd = resto.substring(0, 3);
    }

    resto = resto.substring(dd.length);

    // Primeira parte (prefixo)
    if (resto.length > 0) pre = resto.substring(0, 4);

    // Segunda parte (sufixo)
    if (resto.length > 4) su = resto.substring(4, 8);

    // MONTAGEM DO FORMATO
    let formatado = `+${cc}`;

    if (dd) formatado += ` (${dd})`;
    if (pre) formatado += ` ${pre}`;
    if (su) formatado += `-${su}`;

    e.target.value = formatado;
});

