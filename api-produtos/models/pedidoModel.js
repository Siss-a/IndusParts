// models/PedidoModel.js
import { getConnection } from "../config/database.js";

class PedidoModel {

  static async criarPedidoComItens(id_usuario, endereco, itens) {
    const connection = await getConnection();
    try {
      await connection.beginTransaction();

      // gerar número de pedido simples (ex: PED-20251127-1234) - você pode customizar
      const numeroPedido = `PED-${Date.now()}`;

      const [resPedido] = await connection.execute(
        "INSERT INTO pedidos (numero_pedido, id_cliente_empresa, endereco) VALUES (?, ?, ?)",
        [numeroPedido, id_usuario, endereco]
      );
      const id_pedido = resPedido.insertId;

      // inserir itens
      const insertPromises = itens.map(item =>
        connection.execute(
          "INSERT INTO pedido_itens (id_pedido, id_produto, quantidade, preco_unitario) VALUES (?, ?, ?, ?)",
          [id_pedido, item.id_produto, item.quantidade, item.preco_unitario]
        )
      );

      await Promise.all(insertPromises);

      await connection.commit();

      return { id_pedido, numeroPedido };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async buscarPorId(id_pedido) {
    const connection = await getConnection();
    try {

      const [pedidoRows] = await connection.execute(
        "SELECT * FROM pedidos WHERE id = ?",
        [id_pedido]
      );
      if (!pedidoRows.length) return null;

      const pedido = pedidoRows[0];

      const [itens] = await connection.execute(
        `SELECT pi.id, pi.id_produto, pi.quantidade, pi.preco_unitario,
       p.nome, p.img
         FROM pedido_itens pi
         JOIN produtos p ON p.id = pi.id_produto
         WHERE pi.id_pedido = ?`,
        [id_pedido]
      );

      pedido.itens = itens;
      return pedido;
    } finally {
      connection.release();
    }
  }

  static async listarPorUsuario(id_usuario) {
    const connection = await getConnection();
    try {
      const [pedidos] = await connection.execute(
        `SELECT p.id, p.numero_pedido, p.status, p.endereco, p.data_pedido,
                COUNT(pi.id) as total_itens,
                SUM(pi.quantidade * pi.preco_unitario) as total
         FROM pedidos p
         LEFT JOIN pedido_itens pi ON p.id = pi.id_pedido
         WHERE p.id_cliente_empresa = ?
         GROUP BY p.id, p.numero_pedido, p.endereco, p.data_pedido`,
        [id_usuario]
      );

      return pedidos;
    } finally {
      connection.release();
    }
  }

// Listar TODOS os pedidos (admin)
static async listarTodos() {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(`
      SELECT p.id, p.numero_pedido, p.status, p.endereco, p.data_pedido, 
             p.id_cliente_empresa,
             u.nome as nome_cliente,
             COUNT(pi.id) as total_itens,
             SUM(pi.quantidade * pi.preco_unitario) as total
      FROM pedidos p
      LEFT JOIN pedido_itens pi ON p.id = pi.id_pedido
      LEFT JOIN usuarios u ON u.id = p.id_cliente_empresa
      GROUP BY p.id
      ORDER BY p.data_pedido DESC
    `);
    return rows;
  } finally {
    connection.release();
  }
}

// Buscar pedidos por número ou cliente (admin)
static async buscarAdmin(termo) {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(`
      SELECT p.id, p.numero_pedido, p.status, p.endereco, p.data_pedido,
             u.nome as nome_cliente
      FROM pedidos p
      LEFT JOIN usuarios u ON u.id = p.id_cliente_empresa
      WHERE p.numero_pedido LIKE ? OR u.nome LIKE ?
      ORDER BY p.data_pedido DESC
    `, [`%${termo}%`, `%${termo}%`]);

    return rows;
  } finally {
    connection.release();
  }
}
  
}

export default PedidoModel;