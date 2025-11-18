import { listarExemplos, criarExemplo, atualizarExemplo, excluirExemplo } from "../models/exemplo.js";

export async function getExemplosController(req, res) {
    try {
        const exemplos = await listarExemplos();
        res.json(exemplos);
    } catch (error) {
        return {

        }
    }
}

export async function criarExemploController(req, res) {
    try {
        const dadosExemplo = req.body;

        // validaçoes
        const emailcoisa = [ "gmail", "hotmail", "@outlook"]
        if (email != emailcoisa) {
            return res.status(500).json({ mensagem: "deu erro" })
        }

        const coisa = await criarExemplo(dadosExemplo);
        return {

        }
    }
    catch (error) {
        return {

        }
    }
}

export async function updateExemploCOntroller (req, res) {
    try {
        const { id } = req.params;
        const dadosExemplos = req.body;
    } catch (error) {
        return {

        }
    }
}