async function createClient(client, db) {
  const {id, nome, idade, email, id_conta } = client;
  const result = await db.query(
    "INSERT INTO clientes (id, nome, idade, email, id_conta) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [id, nome, idade, email, id_conta]
  );
  return result.rows[0];
}

module.exports = { createClient };
