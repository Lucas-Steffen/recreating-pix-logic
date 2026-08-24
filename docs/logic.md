# Logic

[Português](logicas.md) · [English](logic.md)

Engineering concepts studied during development, using the Pix domain as an excuse. See [Motivation](../README.en.md#motivation) for the general context.

## High volume processing

How to handle thousands of transfer requests arriving at the same time without blocking the system.

## Queues

Decoupling receiving a transfer request from actually processing it, using Redis + BullMQ.

## Concurrency vs parallelism

Understanding the difference in practice and where each approach applies when processing financial transactions.

## Immutability

Modeling transfers, debits and credits as immutable events, avoiding shared mutable state that leads to race conditions.

## Videos watched

List of videos used as reference during development.

- [System Design: Como Projetar um Sistema de Pagamentos](https://www.youtube.com/watch?v=PTkD8DTHp48) (pt-br)

## Reading

- [Concurrency vs Parallelism](https://www.geeksforgeeks.org/operating-systems/difference-between-concurrency-and-parallelism/)
- [DRY](https://www.geeksforgeeks.org/software-engineering/dont-repeat-yourselfdry-in-software-development/)

---

Back to [README](../README.en.md).
