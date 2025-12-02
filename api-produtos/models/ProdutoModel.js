import {
  create,
  read,
  update,
  deleteRecord,
  getConnection,
} from "../config/database.js";

class ProdutoModel {
  // Buscar todos os produtos
  static async listarTodos() {
    return await read("produtos");
  }

  static async buscarPorId(id) {
    try {
      const conn = await getConnection();
      const [rows] = await conn.query("SELECT * FROM produtos WHERE id = ?", [
        id,
      ]);
      return rows[0] || null;
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      throw error;
    } finally {
      conn.release();
    }
  }

  static async buscarPorNome(nome) {
    const conn = await getConnection();
    try {
      const [rows] = await conn.query(
        "SELECT * FROM produtos WHERE nome LIKE ?",
        [`%${nome}%`]
      );

      return rows;
    } catch (error) {
      console.error("Erro ao buscar produto por nome:", error);
      throw error;
    } finally {
      conn.release();
    }
  }

  static async buscarPorCategoria(cat) {
    const conn = await getConnection();
    try {
      const [rows] = await conn.query(
        "SELECT * FROM produtos WHERE id_categoria = ?",
        [cat]
      );
      return rows;
    } catch (error) {
      console.error("Erro ao buscar produto por categoria:", error);
      throw error;
    } finally {
      conn.release();
    }
  }

  static async criar(dadosProduto) {
    return await create("produtos", dadosProduto);
  }

// Atualizar produto
  static async atualizar(id, dadosAtualizados) {
    return await update("produtos", dadosAtualizados, `id = ${id}`);
  }

  // Deletar um produto pelo ID
  static async excluir(id) {
    return await deleteRecord("produtos", `id = ${id}`);
  }

  static async descontarEstoque(produtoId, quantidade) {
    try {
      const conn = await getConnection();

      const [rows] = await conn.query(
        "SELECT estoque FROM produtos WHERE id = ?",
        [produtoId]
      );

      if (rows.length === 0) {
        conn.release();
        throw new Error("Produto não encontrado");
      }

      const estoqueAtual = rows[0].estoque;

      if (estoqueAtual < quantidade) {
        conn.release();
        throw new Error("Estoque insuficiente");
      }

      await conn.query(
        "UPDATE produtos SET estoque = estoque - ? WHERE id = ?",
        [quantidade, produtoId]
      );

      return true;
    } catch (error) {
      console.error("Erro ao descontar estoque:", error);
      throw error;
    } finally {
      conn.release();
    }
  }

  static async contarTodos() {
    const conn = await getConnection();
    try {
      const [rows] = await conn.query("SELECT COUNT(*) AS total FROM produtos");
      return rows[0].total;
    } finally {
      conn.release();
    }
  }

  static async contarCategorias() {
    const conn = await getConnection();
    try {
      const [rows] = await conn.query(
        "SELECT COUNT(*) AS total FROM categorias"
      );
      return rows[0].total;
    } finally {
      conn.release();
    }
  }

  static async topVendidos(limit) {
    const conn = await getConnection();
    const [rows] = await conn.query(
      `SELECT p.id, p.nome, SUM(ip.quantidade) AS vendidos
     FROM itens_pedido ip
     JOIN produtos p ON p.id = ip.produto_id
     GROUP BY p.id
     ORDER BY vendidos DESC
     LIMIT ?`,
      [limit]
    );
    return rows;
  }

  static async estoqueAbaixo(qtde) {
    const conn = await getConnection();
    try {
      const [rows] = await conn.query(
        "SELECT * FROM produtos WHERE estoque <= ?",
        [qtde]
      );
      return rows;
    } finally {
      conn.release();
    }
  }
}

export default ProdutoModel;
