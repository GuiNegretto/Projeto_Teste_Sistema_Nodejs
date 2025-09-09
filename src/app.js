const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database/db");

const clienteRoutes = require("./routes/clienteRoutes");
const contaRoutes = require("./routes/contaRoutes");

const app = express();
app.use(bodyParser.json());

app.use("/clientes", clienteRoutes);
app.use("/contas", contaRoutes);

async function test() {
  try {
    const result = await db.query("SELECT NOW()");
    console.log("Conectado com sucesso:", result.rows[0]);
  } catch (err) {
    console.error("Erro na conexão:", err);
  }
}

test();

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
