# Architecture

[Português](arquitetura.md) · [English](architecture.md)

## Stack

| Layer | Technology |
| --- | --- |
| Language | Node.js + TypeScript |
| Framework | NestJS |
| Database | PostgreSQL + TypeORM |
| Queue / cache | Redis + BullMQ |

## Decisions

- Queue with Redis + BullMQ to decouple receiving a transfer from actually processing it, so the API can handle request spikes without blocking.
- Debits and credits modeled as immutable events, avoiding shared mutable state and race conditions when processing several transactions in parallel.
- Persistence in PostgreSQL through TypeORM.

See [Requirements](requirements.md) for the scope these decisions support and [Logic](logic.md) for the concepts behind them.

## Reading on the stack

- [NestJS](https://docs.nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [TypeORM](https://typeorm.io/)
- [Redis](https://redis.io/docs/latest/)
- [BullMQ](https://docs.bullmq.io/)

---

Back to [README](../README.en.md).
