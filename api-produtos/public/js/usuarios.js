/* Verificar ADMIN antes de carregar a página */
/* window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/login';
        return;
    }

    try {
        const res = await fetch('/api/admin/usuarios', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Se o middleware do backend bloquear → não é admin
        if (res.status === 401 || res.status === 403) {
            alert("Acesso restrito aos administradores.");
            window.location.href = '/perfil';
            return;
        }

        // usuário é admin → continua a página normalmente
        const resposta = await res.json();
        console.log("Admin confirmado:", resposta);

    } catch (error) {
        console.error("Erro ao validar administrador:", error);
        localStorage.removeItem("token");
        window.location.href = "/login";
    }
});
 */

const form = document.getElementById('formCadastro')

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const usuario = document.getElementById('nome_social').value;
    const senha = document.getElementById('senhaCadastro').value;
    const email = document.getElementById('emailCadastro').value;
    const cnpj = document.getElementById('cnpj').value;
    const telefone = document.getElementById('telefone').value;
    const tipo = document.getElementById('tipo').value;

    try {
        const res = await fetch('/api/admin/usuarios', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome_social: usuario,
                senha: senha,
                email: email,
                cnpj: cnpj,
                telefone: telefone,
                tipo: tipo
            })
        });

        const resposta = await res.json();

        if (!res.ok) {
            alert(resposta.erro || "Erro ao cadastrar usuário");
            return;
        }

        alert("Usuário cadastrado com sucesso!");
        form.reset(); // limpa o formulário
        carregarUsuarios(); // atualiza a lista

    } catch (e) {
        console.error("Erro ao cadastrar:", e);
        alert("Erro ao cadastrar usuário");
    }
});

// Listar usuarios e paginação
async function carregarUsuarios() {
    const token = localStorage.getItem("token");

    const pagina = document.getElementById("pagina").value;
    const limite = document.getElementById("limite").value;

    try {
        const res = await fetch(`/api/admin/usuarios?pagina=${pagina}&limite=${limite}`, {
            method: "GET",
            headers: { "Authorization": "Bearer " + token }
        });

        // verifica se resposta é JSON antes de usar
        let data;
        try {
            data = await res.json();
        } catch {
            alert("Resposta inválida do servidor");
            return;
        }

        if (!res.ok) {
            alert(data.erro || "Erro ao listar usuários");
            return;
        }

        montarTabelaUsuarios(data.dados);

        document.getElementById("infoPaginacao").innerHTML = `
            Página <strong>${data.paginacao.pagina}</strong> de <strong>${data.paginacao.totalPaginas}</strong>
            — Total: ${data.paginacao.total} registros
        `;

    } catch (e) {
        console.error("Erro ao carregar usuários:", e);
        alert("Erro ao carregar usuários");
    }
}

// Montar tabela usuarios
function montarTabelaUsuarios(lista) {
    const tbody = document.getElementById("listaUsuarios");
    tbody.innerHTML = "";

    lista.forEach(usuario => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nome_social}</td>
            <td>${usuario.email}</td>
            <td>${usuario.cnpj}</td>
            <td>${usuario.telefone}</td>

            <td>
                <button onclick="editarUsuario(${usuario.id})">Editar</button>
                <button onclick="excluirUsuario(${usuario.id})" style="color:red;">Excluir</button>
            </td>
        `;

        tbody.appendChild(linha);
    });
}

//Formulario de edição
async function editarUsuario(id) {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`/api/admin/usuarios/${id}`, {
            method: "GET",
            headers: { "Authorization": "Bearer " + token }
        });

        const usuario = await res.json();

        document.getElementById("edit_nome_social").value = usuario.nome_social;
        document.getElementById("edit_email").value = usuario.email;
        document.getElementById("edit_cnpj").value = usuario.cnpj;
        document.getElementById("edit_telefone").value = usuario.telefone;

        document.getElementById("secaoEdicao").style.display = "block";

    } catch (e) {
        console.error("Erro ao buscar usuário:", e);
        alert("Erro ao carregar dados do usuário");
    }
}

// Salvar edicao
const formEdicao = document.getElementById("formEdicao");

formEdicao.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const id = document.getElementById("edit_id").value;

    const dados = {
        nome_social: document.getElementById("edit_nome_social").value,
        email: document.getElementById("edit_email").value,
        cnpj: document.getElementById("edit_cnpj").value,
        telefone: document.getElementById("edit_telefone").value
    };

    try {
        const res = await fetch(`/api/admin/usuarios/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const resposta = await res.json();

        if (!res.ok) {
            alert(resposta.erro || "Erro ao atualizar");
            return;
        }

        alert("Usuário atualizado com sucesso!");
        document.getElementById("secaoEdicao").style.display = "none";

        carregarUsuarios();

    } catch (e) {
        console.error("Erro ao atualizar:", e);
        alert("Erro ao salvar alterações");
    }
});
// Cancelar edição
function cancelarEdicao() {
    document.getElementById("secaoEdicao").style.display = "none";
}

// Excluir usuario
async function excluirUsuario(id) {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`/api/admin/usuarios/${id}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        });

        const resposta = await res.json();

        if (!res.ok) {
            alert(resposta.erro || "Erro ao excluir");
            return;
        }

        alert("Usuário excluído!");
        carregarUsuarios();

    } catch (e) {
        console.error("Erro ao excluir:", e);
        alert("Erro ao excluir usuário");
    }
}