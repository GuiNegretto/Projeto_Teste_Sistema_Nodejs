const express = require("express");
const router = express.Router();
const contaController = require("../controllers/contaController");

router.post("/", contaController.criarConta);
router.put("/transferencia", contaController.transferencia);
router.get("/:id", contaController.buscarContaPorId);
router.delete("/:id", contaController.deletarConta);
router.put("/:id/deposito", contaController.depositar);
router.put("/:id/saque", contaController.sacar);
router.get("/:id/saldo", contaController.consultarSaldo);
router.get("/:id/extrato", contaController.consultarExtrato);

module.exports = router;
