# Lógicas

[Português](logicas.md) · [English](logic.md)

Conceitos de engenharia estudados durante o desenvolvimento, usando o domínio do Pix como pretexto. Ver [Motivação](../README.md#motivação) pro contexto geral.

## Processamento de alto volume

Como lidar com milhares de requisições de transferência chegando ao mesmo tempo sem travar o sistema.

## Filas

Desacoplar o recebimento de uma solicitação de transferência do seu processamento efetivo, usando Redis + BullMQ.

## Concorrência vs paralelismo

Entender a diferença na prática e onde cada abordagem se aplica ao processar transações financeiras.

## Imutabilidade

Modelar transferências, débitos e créditos como eventos imutáveis, evitando estado mutável compartilhado que gera condição de corrida.

## Vídeos assistidos

Lista de vídeos usados como referência durante o desenvolvimento.

- [System Design: Como Projetar um Sistema de Pagamentos](https://www.youtube.com/watch?v=PTkD8DTHp48)

## Leituras

- [Concurrency vs Parallelism](https://www.geeksforgeeks.org/operating-systems/difference-between-concurrency-and-parallelism/)
- [DRY](https://www.geeksforgeeks.org/software-engineering/dont-repeat-yourselfdry-in-software-development/)

---

Voltar ao [README](../README.md).
