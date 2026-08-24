# Requisitos

[Português](requisitos.md) · [English](requirements.md)

Requisitos definidos para o projeto, revisados conforme o desenvolvimento avança. Ver [Motivação](../README.md#motivação) pro contexto de por que esse domínio foi escolhido.

## Escopo

- Uma única instituição simulada: um "banco" com contas internas e transferências estilo Pix entre os próprios usuários, sem simulação de múltiplos participantes, SPI ou DICT.
- Regras de negócio simplificadas: conta, saldo, chave pix e transferência básica, sem regras reais do Pix como limite noturno, MED/devolução ou múltiplos tipos de chave.

Essas escolhas foram feitas pra manter o foco nos objetivos de aprendizado (filas, concorrência, imutabilidade) em vez de complexidade de domínio ou negócio.

## Requisitos funcionais

- Criar conta com saldo inicial.
- Consultar saldo.
- Cadastrar chave pix (string única).
- Iniciar transferência (por chave ou id da conta).
- Responder o request na hora, sem processar na hora (assíncrono).
- Processar transferência via fila (débito + crédito).
- Consultar status da transferência.
- Ver extrato da conta.
- Rejeitar transferência com saldo insuficiente.
- Reprocessar transferência que falhou.

## Requisitos não funcionais

- Concorrência sem corrida de dados.
- Consistência do saldo (nunca fica negativo).
- Imutabilidade dos eventos (ledger append-only).
- Idempotência no reprocessamento.
- Fila confiável (retry + dead-letter queue).
- Observabilidade (logs e métricas da fila).
- Escalabilidade horizontal dos workers.
- Persistência (Postgres como fonte da verdade).

## Fora de escopo

- Múltiplas instituições, SPI, DICT.
- Limites noturnos, MED, devolução.
- Múltiplos tipos de chave pix.

---

Voltar ao [README](../README.md).
