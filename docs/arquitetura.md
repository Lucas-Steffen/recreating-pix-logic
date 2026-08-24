# Arquitetura

[Português](arquitetura.md) · [English](architecture.md)

## Stack

| Camada | Tecnologia |
| --- | --- |
| Linguagem | Node.js + TypeScript |
| Framework | NestJS |
| Banco de dados | PostgreSQL + TypeORM |
| Fila / cache | Redis + BullMQ |

## Decisões

- Fila com Redis + BullMQ pra desacoplar o recebimento de uma transferência do seu processamento efetivo, permitindo lidar com picos de requisições sem travar a API.
- Débitos e créditos modelados como eventos imutáveis, evitando estado mutável compartilhado e condições de corrida ao processar várias transações em paralelo.
- Persistência em PostgreSQL via TypeORM.

Ver [Requisitos](requisitos.md) pro escopo que essas decisões atendem e [Lógicas](logicas.md) pros conceitos por trás delas.

## Leituras sobre a stack

- [NestJS](https://docs.nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [TypeORM](https://typeorm.io/)
- [Redis](https://redis.io/docs/latest/)
- [BullMQ](https://docs.bullmq.io/)

---

Voltar ao [README](../README.md).
