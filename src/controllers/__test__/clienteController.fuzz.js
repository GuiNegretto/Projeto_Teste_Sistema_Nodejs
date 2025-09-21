const { FuzzedDataProvider } = require("@jazzer.js/core");

const mockDb = {
  query: () => Promise.resolve({ rows: [] })
};

require.cache[require.resolve('../../database/db')] = {
  exports: mockDb
};

require.cache[require.resolve('../../database/clientDB')] = {
  exports: {
    createClient: async (client, db) => {
      return {
        id: Math.floor(Math.random() * 1000) + 1,
        ...client,
        created_at: new Date().toISOString()
      };
    }
  }
};

const { criarCliente } = require('../clienteController');

const mockRes = {
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    this.jsonData = data;
    return this;
  }
};

module.exports.fuzz = function (fuzzerInputData) {
  const data = new FuzzedDataProvider(fuzzerInputData);

  const clienteFuzz = {
    nome: data.consumeString(5, "utf-8"),
    idade: data.consumeIntegral(1),
    email: data.consumeString(10, "utf-8"),
    id_conta: data.consumeIntegral(1),
  };

  criarCliente({ body: clienteFuzz }, mockRes);
};