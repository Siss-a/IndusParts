import CategoriaModel from '../models/CategoriaModel.js';

class CategoriaController {

    static async criar(req, res) {
        try {
            const { nome, descricao } = req.body;

            if (!nome?.trim()) {
                return res.status(400).json({ sucesso: false, erro: "Nome obrigatório" });
            }

            if (!descricao?.trim()) {
                return res.status(400).json({ sucesso: false, erro: "Descrição obrigatória" });
            }

            const categoriaExistente = await CategoriaModel.buscarPorNome(nome.trim());
            if (categoriaExistente.length > 0) {
                return res.status(409).json({ sucesso: false, erro: "Categoria já existe" });
            }

            const id = await CategoriaModel.criar({
                nome: nome.trim(),
                descricao: descricao.trim()
            });

            return res.status(201).json({
                sucesso: true,
                mensagem: "Categoria criada",
                dados: { id, nome, descricao }
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ sucesso: false, erro: "Erro ao criar categoria" });
        }
    }

    static async listar(req, res) {
        const categorias = await CategoriaModel.listar();
        return res.json({ sucesso: true, dados: categorias });
    }

    static async buscar(req, res) {
        try {
            const { id } = req.params;

            const categoria = await CategoriaModel.buscarPorId(id);
            if (!categoria) {
                return res.status(404).json({ sucesso: false, erro: "Categoria não encontrada" });
            }

            return res.json({ sucesso: true, dados: categoria });

        } catch (err) {
            return res.status(500).json({ sucesso: false, erro: "Erro ao buscar categoria" });
        }
    }

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, descricao } = req.body;

            const existente = await CategoriaModel.buscarPorId(id);
            if (!existente) {
                return res.status(404).json({ sucesso: false, erro: "Categoria não existe" });
            }

            await CategoriaModel.atualizar(id, {
                nome: nome?.trim() || existente.nome,
                descricao: descricao?.trim() || existente.descricao
            });

            return res.json({ sucesso: true, mensagem: "Categoria atualizada" });

        } catch (err) {
            return res.status(500).json({ sucesso: false, erro: "Erro ao atualizar categoria" });
        }
    }

    static async excluir(req, res) {
        try {
            const { id } = req.params;

            const existente = await CategoriaModel.buscarPorId(id);
            if (!existente) {
                return res.status(404).json({ sucesso: false, erro: "Categoria não encontrada" });
            }

            await CategoriaModel.excluir(id);

            return res.json({ sucesso: true, mensagem: "Categoria removida" });

        } catch (err) {
            return res.status(500).json({ sucesso: false, erro: "Erro ao excluir categoria" });
        }
    }
}

export default CategoriaController;
