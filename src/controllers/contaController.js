//const Conta = require("../models/conta");
const db = require("../database/db");



exports.criarConta = async (req, res) => {
 try {

 const { 
 id, 
 saldo = 0, 
 tipo = 'PF', 
 ativa = True,
 limite = 0
 } = req.body;


 if (!id) {
   return res.status(400).json({ error: "O ID da conta é obrigatório." });
 }

 if (tipo !== 'PF' && tipo !== 'PJ') {
  return res.status(400).json({ error: "Tipo de cliente inválido. Use 'PF' ou 'PJ'." });
 }

   const result = await db.query(
      "INSERT INTO contas (id, saldo, tipo, ativa, limite_saque) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id, saldo, tipo, ativa, limite]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar conta" });
  }
};

async function _buscarContaPorId(id) {
    const result = await db.query("SELECT * FROM CONTAS WHERE id = $1", [id]);
    if (result.rows.length === 0) {
        throw new Error("Conta não encontrada.");
    }
    return result.rows[0];
}

async function _depositar(id, valor) {
    const result = await db.query(
        "UPDATE contas SET saldo = saldo + $1 WHERE id = $2 RETURNING *",
        [valor, id]
    );
    return result.rows[0];
}

async function _sacar(id, valor) {
    const conta = await _buscarContaPorId(id);

    if(conta.limite + conta.limite < valor){
      throw new Error("Saldo insuficiente.");
    }

    if(!conta.ativa){
      throw new Error("Conta inativa.");
    }

    const result = await db.query(
        "UPDATE contas SET saldo = saldo - $1 WHERE id = $2 RETURNING *",
        [valor, id]
    );
    return result.rows[0];
}


exports.deletarConta = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            "DELETE FROM contas WHERE id = $1",
            [id]
        );

        if (result.rowCount > 0) {
            res.status(200).json({ mensagem: "Conta deletada com sucesso." });
        } else {
            res.status(404).json({ error: "Conta não encontrada." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao deletar a conta." });
    }
};

exports.buscarContaPorId = async (req, res) => {
    try {
        const conta = await _buscarContaPorId(req.params.id);
        res.json(conta);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

exports.depositar = async (req, res) => {
    try {
        const conta = await _depositar(req.params.id, req.body.valor);
        res.json(conta);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.sacar = async (req, res) => {
    try {
        const conta = await _sacar(req.params.id, req.body.valor);
        res.json(conta);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.transferencia = async (req, res) => {
  const { contaOrigem, contaDestino, valor } = req.body;

  try {
    if (valor <= 0) {
      return res.status(400).json({ error: "Valor deve ser maior que zero." });
    }
    var contaOrigemObj = null;
    try{
     contaOrigemObj = await _buscarContaPorId(contaOrigem);
    }
    catch (err) {
      return res.status(404).json({ error: "Conta de origem não encontrada." });
    }

    try{
     await _buscarContaPorId(contaDestino);
    }
    catch (err) {
      return res.status(404).json({ error: "Conta de destino não encontrada." });
    }

    if (valor > contaOrigemObj.saldo) {
      return res.status(400).json({ error: "Saldo insuficiente na conta de origem." });
    }

    await _sacar(contaOrigem, valor);
    const resultadoDeposito = await _depositar(contaDestino, valor);

    res.status(200).json({
      mensagem: "Transferência realizada com sucesso!"
    });

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Erro ao realizar a transferência." });
  }
};

exports.consultarSaldo = async (req, res) => { /* ... */ };
exports.consultarExtrato = async (req, res) => { /* ... */ };