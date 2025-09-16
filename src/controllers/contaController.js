//const Conta = require("../models/conta");
const db = require("../database/db");

exports.criarConta = async (req, res) => {
  try {
    const { id, saldo } = req.body;
    const result = await db.query(
      "INSERT INTO contas (id, saldo) VALUES ($1, $2) RETURNING *",
      [id, saldo]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar conta" });
  }
};

exports.buscarContaPorId = async (req, res) => {
    try {
        const { id } = req.params; // Captura o ID da URL
        const result = await db.query(
            "SELECT * FROM CONTAS WHERE id = $1",
            [id]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: "Conta não encontrado" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar conta por ID" });
    }
};


exports.depositar = async (req, res) => {
    try {
        const { id } = req.params;
        const { valor } = req.body;

        if (!valor || valor <= 0) {
            return res.status(400).json({ error: "Valor do depósito deve ser um número positivo." });
        }

        const result = await db.query(
            "UPDATE contas SET saldo = saldo + $1 WHERE id = $2 RETURNING *",
            [valor, id]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: "Conta não encontrada." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao realizar depósito." });
    }
};

exports.sacar = async (req, res) => {
    try {
        const { id } = req.params;
        const { valor } = req.body;

        if (!valor || valor <= 0) {
            return res.status(400).json({ error: "Valor do saque deve ser um número positivo." });
        }

        // Primeiro, busca a conta para verificar o saldo
        const contaResult = await db.query(
            "SELECT saldo FROM contas WHERE id = $1",
            [id]
        );

        if (contaResult.rows.length === 0) {
            return res.status(404).json({ error: "Conta não encontrada." });
        }

        const saldoAtual = contaResult.rows[0].saldo;
        if (saldoAtual < valor) {
            return res.status(400).json({ error: "Saldo insuficiente." });
        }

        // Se o saldo for suficiente, atualiza o saldo
        const result = await db.query(
            "UPDATE contas SET saldo = saldo - $1 WHERE id = $2 RETURNING *",
            [valor, id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao realizar saque." });
    }
};

exports.consultarSaldo = async (req, res) => { /* ... */ };
exports.consultarExtrato = async (req, res) => { /* ... */ };