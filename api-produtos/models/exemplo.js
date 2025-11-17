import { create, read, update, deleteRecord } from '../config/database.js';

export async function listarExemplos() {
    try {
        const exemplos = await read();
        return exemplos;
    } catch (error) {
        return {
            error: 'Erro ao listar exemplos',
            details: error.message
        }
    }
}

export async function criarExemplo(dadosExemplo) {
    try {
        const novoExemplo = await create(dadosExemplo);
        return novoExemplo;
    } catch (error) {
        return {
            error: 'Erro ao criar exemplo',
            details: error.message
        }
    }   
}

export async function atualizarExemplo(id, dadosExemplo) {
    try {
        const exemploupdate = await update(dadosExemplo, `id = ${id}`);
        return { exemploupdate };
    } catch (error) {
        return {
            error: 'Erro ao atualizar exemplo',
            details: error.message
        }
    }
}

export async function excluirExemplo(id) {
    try {
        const exemploDeleted = await deleteRecord(`id = ${id}`);
        return { exemploDeleted };
    } catch (error) {
        return {
            error: 'Erro ao excluir exemplo',
            details: error.message
        }
    }
}

