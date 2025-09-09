//const Conta = require("../models/conta");
const db = require("../database/db");

exports.criarConta = async (req, res) => {
  try {
    const { clienteId } = req.body;
    const result = await db.query(
      "INSERT INTO contas (cliente_id, saldo) VALUES ($1, 0) RETURNING *",
      [clienteId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar conta" });
  }
};

exports.depositar = async (req, res) => {
  try {
    const { id } = req.params;
    const { valor } = req.body;

    const result = await db.query(
      "UPDATE contas SET saldo = saldo + $1 WHERE id = $2 RETURNING *",
      [valor, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Conta não encontrada" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao depositar" });
  }
};
