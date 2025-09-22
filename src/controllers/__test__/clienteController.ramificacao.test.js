const { criarCliente } = require("../clienteController");
const db = require("../../database/db");

jest.mock("../../database/db", () => ({
  query: jest.fn(),
}));

describe("Testes de Ramificação para criarCliente", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // Teste o caminho de sucesso (idade >= 18)
  it("deve retornar 201 quando a idade for 18 ou maior", async () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockReq = { body: { nome: "Maria", idade: 25 } };

    db.query.mockResolvedValue({
      rows: [{ id: 1, ...mockReq.body }]
    });

    await criarCliente(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      id: 1,
      nome: "Maria",
      idade: 25,
    });
  });

  // Teste o caminho de erro (idade < 18)
  it("deve retornar 500 com erro de idade inválida quando a idade for menor que 18", async () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockReq = { body: { nome: "Pedro", idade: 17 } };

    await criarCliente(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Idade inválida" });
    // Garante que o método de criação do cliente não foi chamado
    expect(db.query).not.toHaveBeenCalled();
  });
});
