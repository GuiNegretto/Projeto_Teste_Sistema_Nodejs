const request = require('supertest');
const { app } = require("../../app"); // pega só o app

async function resetConta(id) {
    const res = await request(app)
      .delete(`/contas/${id}`);
      //console.log(`status: ${res.status}`)
}

describe('Matriz Ortogonal - Criação de Conta', () => {

  const idConta = 666;

  it('PF Ativa Sem Limite', async () => {
    await resetConta(idConta);
    const res = await request(app)
      .post('/contas')
      .send({ id: idConta, tipo: 'PF', saldo: 0, ativa: true, limite: 0 });

    expect(res.status).toBe(201);
    expect(res.body.ativa).toBe(true);
    expect(parseFloat(res.body.saldo)).toBe(0);
    
  });
  

  it('PF Inativa Com Limite', async () => {
    await resetConta(idConta);
    const res = await request(app)
      .post('/contas')
      .send({ id: idConta, tipo: 'PF', saldo: 1000, ativa: false, limite: 500 });
    //console.log(res.status);

    expect(res.status).toBe(201);
    expect(res.body.ativa).toBe(false);

    // tentar sacar → deve falhar
    const resSaque = await request(app)
      .put(`/contas/${res.body.id}/saque`)
      .send({ valor: 50 });

    expect(resSaque.status).toBe(400);
    expect(resSaque.body.error).toMatch(/inativa/i);
  });

   it('PJ Inativa Com Limite', async () => {
        await resetConta(idConta);
        const res = await request(app)
            .post('/contas')
            .send({ id: idConta, tipo: 'PJ', saldo: 0, ativa: false, limite: 500 });
        
        expect(res.status).toBe(201);
        expect(res.body.tipo).toBe('PJ');
        expect(parseFloat(res.body.saldo)).toBe(0);
        expect(res.body.ativa).toBe(false);
        expect(parseFloat(res.body.limite_saque)).toBe(500);
    });
    

     it('PJ Ativa Sem Limite', async () => {
        await resetConta(idConta);
        const res = await request(app)
            .post('/contas')
            .send({id: idConta, tipo: 'PJ', saldo: 1000, ativa: true, limite: 0 });
        
        expect(res.status).toBe(201);
        expect(res.body.tipo).toBe('PJ');
        expect(parseFloat(res.body.saldo)).toBe(1000);
        expect(res.body.ativa).toBe(true);
        expect(res.body.limite_saque).toBe(0);
    });
});
