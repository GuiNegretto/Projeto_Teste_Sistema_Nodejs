const { Client } = require("pg");
const { PostgreSqlContainer } = require("@testcontainers/postgresql");
const { createClient } = require("../clientDB");

describe("Customer Repository", () => {
  jest.setTimeout(60000);

  let postgresContainer;
  let postgresClient;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer('postgres:latest').start();
    postgresClient = new Client({ connectionString: postgresContainer.getConnectionUri() });
    await postgresClient.connect();

    const sql = "CREATE TABLE IF NOT EXISTS clientes (id INT NOT NULL, nome VARCHAR NOT NULL, idade INT NOT NULL, email VARCHAR NOT NULL, id_conta INT, PRIMARY KEY (id))";
    await postgresClient.query(sql);
  });

  afterAll(async () => {
    await postgresClient.end();
    await postgresContainer.stop();
  });

  it("should create and return a client", async () => {
    const customer = { id: 1, nome: "John Doe", idade: 26, email: 'johndoe@gmail.com', id_conta: 1 };
    const response = await createClient(customer, postgresClient);

    expect(response).toEqual(customer);
  });
});
