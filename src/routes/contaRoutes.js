const express = require("express");
const router = express.Router();
const contaController = require("../controllers/contaController");

router.post("/", contaController.criarConta);
router.get("/:id", contaController.buscarContaPorId);
router.put("/:id/deposito", contaController.depositar);
router.put("/:id/saque", contaController.sacar);
router.get("/:id/saldo", contaController.consultarSaldo);
router.get("/:id/extrato", contaController.consultarExtrato);

module.exports = router;
