//const Cliente = require("../models/cliente");
const db = require("../database/db");

exports.criarCliente = async (req, res) => {
  try {
    const { nome, cpf } = req.body;
    const result = await db.query(
      "INSERT INTO clientes (nome, cpf) VALUES ($1, $2) RETURNING *",
      [nome, cpf]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar cliente" });
  }
};

exports.listarClientes = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM clientes");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar clientes" });
  }
};
