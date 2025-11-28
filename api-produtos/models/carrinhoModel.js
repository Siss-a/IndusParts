// models/CarrinhoModel.js
import { getConnection } from "../config/database.js";

class CarrinhoModel {
  //pega o carrinho do usuário ou cria um se ele não tiver
  static async getOrCreateCarrinho(id_usuario) {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        "SELECT * FROM carrinhos WHERE id_usuario = ?",
        [id_usuario]
      );
      //verifica quantos elementos existem no array e se diferente de 0 retorna o primeiro elemento
      if (rows.length) return rows[0];

      const [result] = await connection.execute(
        "INSERT INTO carrinhos (id_usuario) VALUES (?)",
        [id_usuario]
      );
      return { id: result.insertId, id_usuario };
    } finally {
      connection.release();
    }
  }

  static async listarItens(id_carrinho) {
    const connection = await getConnection();
    try {
      //lista os campos do carrinho
      const [rows] = await connection.execute(
        `SELECT ci.id AS id_item, ci.id_produto, ci.quantidade, ci.preco_unitario,
                p.nome, p.img, p.descricao
         FROM carrinho_itens ci
         JOIN produtos p ON p.id = ci.id_produto
         WHERE ci.id_carrinho = ?`,
        [id_carrinho]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  //adiciona itens ao carrinho 
  static async adicionarItem(id_carrinho, id_produto, quantidade, preco_unitario) {
    const connection = await getConnection();
    try {
      // se item existe, soma a quantidade
      const [rows] = await connection.execute(
        "SELECT * FROM carrinho_itens WHERE id_carrinho = ? AND id_produto = ?",
        [id_carrinho, id_produto]
      );

      if (rows.length) {
        const existente = rows[0];
        const novaQtd = existente.quantidade + quantidade;
        await connection.execute(
          "UPDATE carrinho_itens SET quantidade = ?, preco_unitario = ? WHERE id = ?",
          [novaQtd, preco_unitario, existente.id]
        );
        return { updated: true };
      } else {
        const [result] = await connection.execute(
          "INSERT INTO carrinho_itens (id_carrinho, id_produto, quantidade, preco_unitario) VALUES (?, ?, ?, ?)",
          [id_carrinho, id_produto, quantidade, preco_unitario]
        );
        return { insertedId: result.insertId };
      }
    } finally {
      connection.release();
    }
  }

  static async atualizarQuantidade(id_item, quantidade) {
    const connection = await getConnection();
    try {
      if (quantidade <= 0) {
        //deleta do carrinho se for menor que 0 a quantidade
        const [res] = await connection.execute(
          "DELETE FROM carrinho_itens WHERE id = ?",
          [id_item]
        );
        return res.affectedRows;
      } else {
        const [res] = await connection.execute(
          "UPDATE carrinho_itens SET quantidade = ? WHERE id = ?",
          [quantidade, id_item]
        );
        return res.affectedRows;
      }
    } finally {
      connection.release();
    }
  }

  //Remover item do carrinho
  static async removerItem(id_item) {
    const connection = await getConnection();
    try {
      const [res] = await connection.execute(
        "DELETE FROM carrinho_itens WHERE id = ?",
        [id_item]
      );
      return res.affectedRows;
    } finally {
      connection.release();
    }
  }

  //apaga todos os itens do carrinho(que tem o msm id do carrinho)
  static async limparCarrinho(id_carrinho) {
    const connection = await getConnection();
    try {
      const [res] = await connection.execute(
        "DELETE FROM carrinho_itens WHERE id_carrinho = ?",
        [id_carrinho]
      );
      return res.affectedRows;
    } finally {
      connection.release();
    }
  }

  //multiplica a quantidade pelo preço unitário 
  static async calcularTotal(id_carrinho) {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        "SELECT SUM(quantidade * preco_unitario) AS total FROM carrinho_itens WHERE id_carrinho = ?",
        [id_carrinho]
      );
      return rows[0].total || 0;
    } finally {
      connection.release();
    }
  }
}

export default CarrinhoModel;