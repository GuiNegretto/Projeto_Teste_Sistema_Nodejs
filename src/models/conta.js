class Conta {
    constructor(id, clienteId, saldo = 0) {
        this.id = id;
        this.clienteId = clienteId;
        this.saldo = saldo;
        this.limite_saque = 5000;
        this.tipo = "PF";
        this.ativa = True;
        this.transacoes = [];
    }

    depositar(valor) {
        this.saldo += valor;
        this.transacoes.push({ tipo: "DEPÓSITO", valor, data: new Date() });
    }

    sacar(valor) {
        if (valor > this.saldo) throw new Error("Saldo insuficiente");
        this.saldo -= valor;
        this.transacoes.push({ tipo: "SAQUE", valor, data: new Date() });
    }
}

module.exports = Conta;
