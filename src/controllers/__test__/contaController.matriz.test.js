const request = require('supertest');
const { app } = require("../../app"); // pega só o app

describe('Matriz de Decisão - Saque/Depósito (Simulação de Transferência)', () => {
  const _contaOrigem = 1;
  const _contaDestino = 2;

  it('CT01 - Conta de origem inexistente', async () => {
    const res = await request(app)
      .put('/contas/transferencia')
      .send({ contaOrigem: 999, contaDestino: _contaDestino,valor: 10 });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('CT02 - Conta de destino inexistente', async () => {
    // saque válido
    const res = await request(app)
      .put('/contas/transferencia')
      .send({ contaOrigem: _contaOrigem, contaDestino: 999,valor: 10 });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('CT03 - Saldo insuficiente', async () => {
    const res = await request(app)
      .put(`/contas/transferencia`)
      .send({ contaOrigem: _contaOrigem, contaDestino: _contaDestino, valor: 99999 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/saldo/i);
  });

  it('CT04 - Valor inválido', async () => {
    const res = await request(app)
      .put(`/contas/transferencia`)
      .send({contaOrigem: _contaOrigem, contaDestino: _contaDestino, valor: 0 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/valor/i);
  });

  it('CT05 - Fluxo completo (transferência bem-sucedida)', async () => {
    const saldoAntesOrigem = parseFloat((await request(app).get(`/contas/${_contaOrigem}`)).body.saldo);
    const saldoAntesDestino = parseFloat((await request(app).get(`/contas/${_contaDestino}`)).body.saldo);

      await request(app)
      .put('/contas/transferencia')
      .send({ contaOrigem: _contaOrigem, contaDestino: _contaDestino, valor: 10 })
      .expect(200);

    const saldoDepoisOrigem = parseFloat((await request(app).get(`/contas/${_contaOrigem}`)).body.saldo);
    //console.log(`Saldo orig dps: ${saldoDepoisOrigem}`);
    const saldoDepoisDestino = parseFloat((await request(app).get(`/contas/${_contaDestino}`)).body.saldo);
    //console.log(`Saldo dest dps: ${saldoDepoisDestino}`);

    expect(saldoDepoisOrigem).toBe(saldoAntesOrigem - 10);
    expect(saldoDepoisDestino).toBe(saldoAntesDestino + 10);
  });
});
