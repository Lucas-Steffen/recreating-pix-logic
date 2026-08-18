<div align="center">

# Recreating Pix Logic

Study project that recreates, in a simplified way, the logic behind Pix, the Brazilian instant payment system that became a world reference in real time transfers.

[Português](README.md) · [English](README.en.md)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-FF4438?style=for-the-badge)

</div>

---

## Table of contents

- [Motivation](#motivation)
- [Roadmap](#roadmap)
- [Current status](#current-status)
- [Stack](#stack)
- [Videos watched](#videos-watched)
- [Documentation](#documentation)
- [Author](#author)

## Motivation

The goal here isn't to build a real financial product, but to use the Pix domain as an excuse to study engineering problems that show up in high scale systems:

- Processing thousands of requests: how to handle a large volume of transactions arriving at the same time.
- Queue systems: decoupling receiving a transfer request from actually processing it.
- Concurrency vs. parallelism: understanding the difference in practice and where each approach applies when processing financial transactions.
- Immutability: modeling transfers, debits and credits as immutable events, avoiding shared mutable state that leads to race conditions.
- How Pix works under the hood: understanding, as much as possible, the flows and guarantees that make Pix a reliable technology recognized worldwide.

## Roadmap

Development is incremental, adding complexity little by little:

- [ ] Initial account and balance modeling
- [ ] Debits and credits as immutable operations
- [ ] Transfers between accounts (simplified Pix)
- [ ] Transaction processing queue
- [ ] Load and concurrency testing (thousands of simultaneous requests)
- [ ] Consistency and idempotency strategies

## Current status

Early stage project, basic [NestJS](https://nestjs.com/) scaffold.

## Stack

| Layer | Technology |
| --- | --- |
| Language | Node.js + TypeScript |
| Framework | NestJS |
| Database | PostgreSQL + TypeORM |
| Queue / cache | Redis + BullMQ |

## Videos watched

List of videos used as reference during development.

- 

## Documentation

List of docs and articles read during development.

- [Concurrency-VS-Parallelism](https://www.geeksforgeeks.org/operating-systems/difference-between-concurrency-and-parallelism/)
- [DRY](https://www.geeksforgeeks.org/software-engineering/dont-repeat-yourselfdry-in-software-development/)
- [NestJS](https://docs.nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [TypeORM](https://typeorm.io/)
- [Redis](https://redis.io/docs/latest/)
- [BullMQ](https://docs.bullmq.io/)

## Author

<div align="center">

Built by **Lucas Steffen**

[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/steffen_lucasgabriel/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Lucas-Steffen)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/lucasteffen/)

</div>
