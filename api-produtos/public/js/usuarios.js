/* Verificar ADMIN antes de carregar a página */
window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/login';
        return;
    }

    try {
        const res = await fetch('/api/usuarios', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Se o middleware do backend bloquear → não é admin
        if (res.status === 403) {
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

// Listar usuarios e paginação
async function carregarUsuarios() {
    const token = localStorage.getItem("token");

    const pagina = document.getElementById("pagina").value;
    const limite = document.getElementById("limite").value;

    try {
        const res = await fetch(`/api/usuarios?pagina=${pagina}&limite=${limite}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
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

            <td style="display:flex;align-items: center;">
                <button class="btn-buy btn btn-sm btn-editar" data-id="${usuario.id}">Editar</button>
                <span class="ms-2 btn-excluir  material-icons lixeira btnExcluir" style="cursor: pointer;" data-id="${usuario.id}" style="color:red;">delete</span>
            </td>
        `;

        tbody.appendChild(linha);
    });
}

/* CADASTRO DE USUÁRIOS */
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
        const res = await fetch('/api/usuarios', {
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

/* EDIÇÃO */
let usuarioAtual = null; // objeto carregado para edição

// Quando clicar no botão editar
async function editarUsuario(id) {
    console.log("Editar usuario com id:", id);

    const token = localStorage.getItem("token");

    // Buscar dados do usuário
    const res = await fetch(`/api/usuarios/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const body = await res.json();

    if (!body.sucesso) {
        alert("Erro ao carregar usuário");
        return;
    }

    usuarioAtual = body.dados; // guarda original para comparar
    console.log("Usuário carregado:", usuarioAtual);

    // Preencher campos no modal
    document.getElementById("edit_nome_social").value = usuarioAtual.nome_social;
    document.getElementById("edit_email").value = usuarioAtual.email;
    document.getElementById("edit_telefone").value = usuarioAtual.telefone;
    document.getElementById("editTipo").value = usuarioAtual.tipo;

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById("modalEdicao"));
    modal.show();
}

/* SALVAR EDIÇÃO */
const salvarEdicao = document.getElementById("btnSalvarEdicao");
salvarEdicao.addEventListener("click", async () => {
    try {
        if (!usuarioAtual || !usuarioAtual.id) {
            alert("Nenhum usuário carregado para edição.");
            return;
        }

        console.log("Salvar edição para usuário id:", usuarioAtual.id);
        const token = localStorage.getItem("token");
        const id = usuarioAtual.id;

        const novoNome = document.getElementById("edit_nome_social")?.value.trim() ?? "";
        const novoEmail = document.getElementById("edit_email")?.value.trim() ?? "";
        const novoTelefone = document.getElementById("edit_telefone")?.value.trim() ?? "";
        const novoTipo = document.getElementById("editTipo")?.value ?? "";

        let campoEditado = {};

        if (novoNome && novoNome !== usuarioAtual.nome_social) {
            campoEditado.nome_social = novoNome;
        }
        if (novoEmail && novoEmail !== usuarioAtual.email) {
            campoEditado.email = novoEmail;
        }
        if (novoTelefone && novoTelefone !== usuarioAtual.telefone) {
            campoEditado.telefone = novoTelefone;
        }
        if (novoTipo && novoTipo !== usuarioAtual.tipo) {
            campoEditado.tipo = novoTipo;
        }

        if (Object.keys(campoEditado).length === 0) {
            alert("Nenhuma alteração detectada.");
            return;
        }

        console.log("Edição enviada:", campoEditado);

        // Fazer a requisição e tratar status HTTP corretamente
        const res = await fetch(`/api/usuarios/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(campoEditado)
        });

        // tenta ler json de forma segura
        let resposta;
        try {
            resposta = await res.json();
        } catch (err) {
            console.error("Resposta inválida ao atualizar:", err);
            alert("Resposta inválida do servidor ao atualizar.");
            return;
        }

        if (!res.ok) {
            console.error("Erro na atualização:", resposta);
            alert(resposta.erro || resposta.mensagem || "Erro ao atualizar usuário");
            return;
        }

        // sucesso
        alert("Usuário atualizado com sucesso!");

        // fechar modal corretamente (não criar novo)
        const modalEl = document.getElementById("modalEdicao");
        const modalInst = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modalInst.hide();

        // atualizar tabela
        carregarUsuarios();
    } catch (error) {
        console.error("Erro ao salvar edição:", error);
        alert("Erro ao atualizar usuário (verifique console/network).");
    }
});


// Cancelar edição
function cancelarEdicao() {
    bootstrap.Modal.getInstance(document.getElementById("modalEdicao")).hide();
}

// Excluir usuario
async function excluirUsuario(id) {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`/api/usuarios/${id}`, {
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

// Mascara CNPJ
document.getElementById("cnpj").addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 14) value = value.slice(0, 14);

    e.target.value = value
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
});

// Mascara Telefone
function mascaraTelefoneFixoPais(e) {
    let valor = e.target.value.replace(/\D/g, ""); // remove tudo que não é número
    if (valor.length > 12) valor = valor.slice(0, 12); // +55 + DDD + número fixo (2+2+8=12)

    if (valor.length > 4) {
        // separa código do país, DDD e telefone
        valor = valor.replace(/(\d{2})(\d{2})(\d{0,4})(\d{0,4})/, "+$1 ($2) $3-$4");
    } else if (valor.length > 2) {
        valor = valor.replace(/(\d{2})(\d+)/, "+$1 ($2");
    } else if (valor.length > 0) {
        valor = "+" + valor;
    }

    e.target.value = valor;
}

// Aplica nos inputs de telefone
document.getElementById("telefone").addEventListener("input", mascaraTelefoneFixoPais);
document.getElementById("edit_telefone").addEventListener("input", mascaraTelefoneFixoPais);

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-editar")) {
        const id = e.target.dataset.id;
        editarUsuario(id);
    }
    if (e.target.classList.contains("btn-excluir")) {
        excluirUsuario(e.target.dataset.id);
    }
});

carregarUsuarios();