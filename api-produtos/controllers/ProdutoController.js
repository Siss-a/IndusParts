import ProdutoModel from '../models/ProdutoModel.js';

class ProdutoController {

  // POST /produtos
  static async criarProduto(req, res) {
    try {
      const { nome, descricao, id_categoria, fornecedor, tipo, especificacoes, ativo } = req.body;

      // Validações básicas
      if (!nome?.trim()) {
        return res.status(400).json({ sucesso: false, erro: 'Nome obrigatório' });
      }

      if (!descricao?.trim()) {
        return res.status(400).json({ sucesso: false, erro: 'Descrição obrigatória' });
      }

      if (!id_categoria) {
        return res.status(400).json({ sucesso: false, erro: 'Categoria obrigatória' });
      }

      if (!fornecedor?.trim()) {
        return res.status(400).json({ sucesso: false, erro: 'Fornecedor obrigatório' });
      }

      if (!tipo?.trim()) {
        return res.status(400).json({ sucesso: false, erro: 'Tipo obrigatório' });
      }

      if (!especificacoes?.trim()) {
        return res.status(400).json({ sucesso: false, erro: 'Especificações obrigatórias' });
      }

      // Nome duplicado
      const produtoExistente = await ProdutoModel.buscarPorNome(nome.trim());
      if (produtoExistente) {
        return res.status(409).json({ sucesso: false, erro: 'Produto já cadastrado' });
      }

      // Converter ativo para boolean
      let valorAtivo = true;
      if (typeof ativo === "boolean") {
        valorAtivo = ativo;
      } else if (typeof ativo === "string") {
        valorAtivo = ativo.toLowerCase() === "true";
      }

      const imagem = req.file ? `/uploads/produtos/${req.file.filename}` : null;

      // Dados finalizados
      const dadosProduto = {
        nome: nome.trim(),
        descricao: descricao.trim(),
        id_categoria,
        fornecedor: fornecedor.trim().toLowerCase(),
        tipo: tipo.trim(),
        especificacoes: especificacoes.trim(),
        ativo: valorAtivo,
        imagem
      };

      const produtoId = await ProdutoModel.criar(dadosProduto);

      return res.status(201).json({
        sucesso: true,
        mensagem: 'Produto criado com sucesso',
        dados: { id: produtoId, ...dadosProduto }
      });

    } catch (error) {
      console.error('Erro ao criar produto:', error);
      return res.status(500).json({ sucesso: false, erro: 'Erro interno ao criar produto' });
    }
  }

  // PUT /produtos/:id
  static async atualizarProduto(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({ sucesso: false, erro: 'ID inválido' });
      }

      const existente = await ProdutoModel.buscarPorId(id);

      if (!existente) {
        return res.status(404).json({ sucesso: false, erro: 'Produto não encontrado' });
      }

      const { nome, descricao, id_categoria, fornecedor, tipo, especificacoes, ativo } = req.body;
      const dadosAtualizacao = {};

      if (nome !== undefined) {
        if (!nome.trim()) {
          return res.status(400).json({ sucesso: false, erro: 'Nome inválido' });
        }
        const duplicado = await ProdutoModel.buscarPorNome(nome.trim());
        if (duplicado && duplicado.id !== Number(id)) {
          return res.status(409).json({ sucesso: false, erro: 'Produto já cadastrado' });
        }
        dadosAtualizacao.nome = nome.trim();
      }

      if (descricao !== undefined) {
        if (!descricao.trim()) {
          return res.status(400).json({ sucesso: false, erro: 'Descrição inválida' });
        }
        dadosAtualizacao.descricao = descricao.trim();
      }

      if (id_categoria !== undefined) {
        if (!id_categoria) {
          return res.status(400).json({ sucesso: false, erro: 'Categoria inválida' });
        }
        dadosAtualizacao.id_categoria = id_categoria;
      }

      if (fornecedor !== undefined) {
        if (!fornecedor.trim()) {
          return res.status(400).json({ sucesso: false, erro: 'Fornecedor inválido' });
        }
        dadosAtualizacao.fornecedor = fornecedor.trim().toLowerCase();
      }

      if (tipo !== undefined) {
        if (!tipo.trim()) {
          return res.status(400).json({ sucesso: false, erro: 'Tipo inválido' });
        }
        dadosAtualizacao.tipo = tipo.trim();
      }

      if (especificacoes !== undefined) {
        if (!especificacoes.trim()) {
          return res.status(400).json({ sucesso: false, erro: 'Especificações inválidas' });
        }
        dadosAtualizacao.especificacoes = especificacoes.trim();
      }

      if (ativo !== undefined) {
        if (typeof ativo === "boolean") {
          dadosAtualizacao.ativo = ativo;
        } else if (typeof ativo === "string") {
          dadosAtualizacao.ativo = ativo.toLowerCase() === "true";
        } else {
          return res.status(400).json({
            sucesso: false,
            erro: 'O campo ativo deve ser true ou false'
          });
        }
      }

      await ProdutoModel.atualizar(id, dadosAtualizacao);

      return res.json({
        sucesso: true,
        mensagem: "Produto atualizado com sucesso",
        dados: dadosAtualizacao
      });

    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return res.status(500).json({ sucesso: false, erro: 'Erro interno ao atualizar produto' });
    }
  }

  // DELETE /produtos/:id
  static async excluirProduto(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({ sucesso: false, erro: 'ID inválido' });
      }

      const existente = await ProdutoModel.buscarPorId(id);

      if (!existente) {
        return res.status(404).json({ sucesso: false, erro: 'Produto não encontrado' });
      }

      await ProdutoModel.excluir(id);

      return res.json({ sucesso: true, mensagem: 'Produto excluído com sucesso' });

    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      return res.status(500).json({ sucesso: false, erro: 'Erro interno ao excluir produto' });
    }
  }

  //GET sem paginação
  static async listar(req, res) {
    const dados = await ProdutoModel.listar();
    res.json(dados);
  }

  // GET /produtos
  static async listarProdutos(req, res) {
    try {
      const pagina = parseInt(req.query.pagina) || 1;
      const limite = parseInt(req.query.limite) || 10;

      const limiteMaximo = parseInt(process.env.PAGINACAO_LIMITE_MAXIMO) || 100;

      if (pagina < 1) {
        return res.status(400).json({ sucesso: false, erro: 'Página inválida' });
      }

      if (limite < 1 || limite > limiteMaximo) {
        return res.status(400).json({ sucesso: false, erro: 'Limite inválido' });
      }

      const resultado = await ProdutoModel.listarTodos(pagina, limite);

      return res.json({
        sucesso: true,
        dados: resultado.produtos,
        paginacao: {
          pagina: resultado.pagina,
          limite: resultado.limite,
          total: resultado.total,
          totalPaginas: resultado.totalPaginas
        }
      });

    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      return res.status(500).json({ sucesso: false, erro: 'Erro interno ao listar produtos' });
    }
  }

  // GET /produtos/:id
  static async buscarProduto(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({ sucesso: false, erro: 'ID inválido' });
      }

      const produto = await ProdutoModel.buscarPorId(id);

      if (!produto) {
        return res.status(404).json({ sucesso: false, erro: 'Produto não encontrado' });
      }

      return res.json({ sucesso: true, dados: produto });

    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return res.status(500).json({ sucesso: false, erro: 'Erro interno ao buscar produto' });
    }
  }

  // GET /produtos/buscar/nome
  static async buscarPorNome(req, res) {
    try {
      const { valor } = req.query;

      if (!valor || !valor.trim()) {
        return res.status(400).json({ sucesso: false, erro: "Nome inválido" });
      }

      const produtos = await ProdutoModel.buscarPorNome(valor.trim());

      return res.json({ sucesso: true, dados: produtos });

    } catch (error) {
      console.error("Erro ao buscar por nome:", error);
      return res.status(500).json({ sucesso: false, erro: "Erro interno ao buscar por nome" });
    }
  }

  // GET /produtos/buscar/categoria
  static async buscarPorCategoria(req, res) {
    try {
      const { valor } = req.query;

      if (!valor || !valor.trim()) {
        return res.status(400).json({ sucesso: false, erro: "Categoria inválida" });
      }

      const produtos = await ProdutoModel.buscarPorCategoria(valor.trim());

      return res.json({ sucesso: true, dados: produtos });

    } catch (error) {
      console.error("Erro ao buscar por categoria:", error);
      return res.status(500).json({ sucesso: false, erro: "Erro interno ao buscar por categoria" });
    }
  }

}

export default ProdutoController;
