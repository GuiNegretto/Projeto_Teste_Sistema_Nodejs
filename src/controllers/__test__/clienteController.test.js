const { criarCliente } = require("../clienteController");

jest.mock("../../database/clientDB", () => ({
  createClient: jest.fn(),
}));

const { createClient } = require("../../database/clientDB");

describe("criarCliente", () => {
  it("deve retornar 201 com idade maior ou igual a 18", async () => {
    const cliente1 = { nome: "João", idade: 18 };
    const cliente2 = { nome: "João", idade: 19 };

    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    createClient.mockResolvedValue({ id: 1, ...cliente1 });

    await criarCliente({ body: cliente1 }, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ id: 1, ...cliente1 });

    createClient.mockResolvedValue({ id: 2, ...cliente2 });

    await criarCliente({ body: cliente2 }, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ id: 2, ...cliente2 });
  });

  it("deve retornar 500 com idade menor que 18", async () => {
    const cliente = { nome: "João", idade: 17 };

    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    createClient.mockResolvedValue({ id: 1, ...cliente });

    await criarCliente({ body: cliente }, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Idade inválida" });
  });
});