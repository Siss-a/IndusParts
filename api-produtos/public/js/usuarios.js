/* Carregar dados do usuário */
window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/login';
        return;
    }

    try {
        const res = await fetch('/api/admin', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json'
            }
        });

        if (res.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
    }
});

const form = document.getElementById('formCadastro')

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usuario = document.getElementById('nome_social').value;
    const senha = document.getElementById('senhaCadastro').value;
    const email = document.getElementById('emailCadastro').value;
    const cnpj = document.getElementById('cnpj').value;
    const telefone = document.getElementById('telefone').value;

    const res = await fetch('/api/admin/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome_social: usuario,
            senha: senha,
            email: email,
            cnpj: cnpj,
            telefone: telefone
        })
    })})