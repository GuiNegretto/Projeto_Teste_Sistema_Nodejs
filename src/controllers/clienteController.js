//const Cliente = require("../models/cliente");
const db = require("../database/db");
const { createClient } = require("../database/clientDB");

exports.criarCliente = async (req, res) => {
  try {
    res.status(201).json(await createClient(req.body, db));
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


exports.buscarClientePorId = async (req, res) => {
    try {
        const { id } = req.params; // Captura o ID da URL
        const result = await db.query(
            "SELECT * FROM clientes WHERE id = $1",
            [id]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: "Cliente não encontrado" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar cliente por ID" });
    }
};

exports.alterarStatusCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { ativo } = req.body; 

        if (typeof ativo !== 'boolean') {
            return res.status(400).json({ error: "O status 'ativo' deve ser um valor booleano (true ou false)." });
        }

        const result = await db.query(
            "UPDATE clientes SET ativo = $1 WHERE id = $2 RETURNING *",
            [ativo, id]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: "Cliente não encontrado." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao alterar o status do cliente." });
    }
};

exports.deletarCliente = async (req, res) => {
    try {
        const { id } = req.params; // Captura o ID da URL

        const result = await db.query(
            "DELETE FROM clientes WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length > 0) {
            res.json({ message: "Cliente deletado com sucesso", cliente: result.rows[0] });
        } else {
            res.status(404).json({ error: "Cliente não encontrado." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao deletar cliente." });
    }
};