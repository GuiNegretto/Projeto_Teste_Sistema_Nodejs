const { depositar, sacar } = require("../contaController");
const db = require("../database/db");

jest.mock("../database/db", () => ({
  query: jest.fn(),
}));

describe("Testes de Caixa Branca para contaController", () => {
  describe("Teste de Ramificação para 'depositar'", () => {
    // Caso de sucesso (caminho feliz)
    it("deve realizar o depósito com sucesso para um valor positivo", async () => {
      const mockReq = { params: { id: 1 }, body: { valor: 50 } };
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      db.query.mockResolvedValue({
        rows: [{ id: 1, saldo: 150 }],
      });

      await depositar(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ id: 1, saldo: 150 });
      expect(mockRes.status).not.toHaveBeenCalledWith(400); // Garante que o status 400 não foi chamado
    });

    // Caso de erro (valor inválido)
    it("deve retornar 400 para um valor de depósito inválido (zero ou negativo)", async () => {
      const mockReqInvalido = { params: { id: 1 }, body: { valor: 0 } };
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await depositar(mockReqInvalido, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Valor do depósito deve ser um número positivo.",
      });
      expect(db.query).not.toHaveBeenCalled(); // Garante que a query não foi executada
    });
  });

  describe("Testes de Ramificação e Loops para 'sacar'", () => {
    // Caminho de sucesso
    it("deve realizar o saque com sucesso se o saldo for suficiente", async () => {
      const mockReq = { params: { id: 1 }, body: { valor: 50 } };
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      // Mock da busca de saldo (primeira query)
      db.query.mockResolvedValueOnce({
        rows: [{ saldo: 100 }],
      });
      // Mock do update do saldo (segunda query)
      db.query.mockResolvedValueOnce({
        rows: [{ id: 1, saldo: 50 }],
      });

      await sacar(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({ id: 1, saldo: 50 });
    });

    // Caminho de erro - Saldo insuficiente (primeira ramificação)
    it("deve retornar 400 se o saldo for insuficiente", async () => {
      const mockReq = { params: { id: 1 }, body: { valor: 150 } };
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      // Mock da busca de saldo
      db.query.mockResolvedValueOnce({
        rows: [{ saldo: 100 }],
      });

      await sacar(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Saldo insuficiente.",
      });
      // Garante que a query de update não foi chamada
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    // Caminho de erro - Conta não encontrada (segunda ramificação)
    it("deve retornar 404 se a conta não for encontrada", async () => {
      const mockReq = { params: { id: 999 }, body: { valor: 50 } };
      const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      // Mock da busca de saldo (retorna um array vazio)
      db.query.mockResolvedValueOnce({
        rows: [],
      });

      await sacar(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Conta não encontrada.",
      });
    });
  });
});
