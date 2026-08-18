<div align="center">

# Recriando a lógica do Pix

Projeto de estudo que recria, de forma simplificada, a lógica por trás do Pix, o sistema de pagamentos instantâneos brasileiro que se tornou referência mundial em transferências em tempo real.

[Português](README.md) · [English](README.en.md)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-FF4438?style=for-the-badge)

</div>

---

## Índice

- [Motivação](#motivação)
- [Roadmap](#roadmap)
- [Status atual](#status-atual)
- [Stack](#stack)
- [Vídeos assistidos](#vídeos-assistidos)
- [Documentações](#documentações)
- [Autor](#autor)

## Motivação

O objetivo aqui não é construir um produto financeiro real, e sim usar o domínio do Pix como pretexto pra estudar problemas de engenharia que aparecem em sistemas de alta escala:

- Processamento de milhares de requisições: como lidar com grande volume de transações chegando ao mesmo tempo.
- Sistemas de fila: desacoplar o recebimento de uma solicitação de transferência do seu processamento efetivo.
- Concorrência vs. paralelismo: entender a diferença na prática e onde cada abordagem se aplica ao processar transações financeiras.
- Imutabilidade: modelar transferências, débitos e créditos como eventos imutáveis, evitando estados mutáveis compartilhados que geram condição de corrida.
- Como o Pix funciona por baixo dos panos: entender, na medida do possível, os fluxos e garantias que tornam o Pix uma tecnologia confiável e reconhecida internacionalmente.

## Roadmap

O desenvolvimento é incremental, adicionando complexidade aos poucos:

- [ ] Modelagem inicial de contas e saldo
- [ ] Débitos e créditos como operações imutáveis
- [ ] Transferências entre contas (Pix simplificado)
- [ ] Fila de processamento de transações
- [ ] Testes de carga e concorrência (milhares de requisições simultâneas)
- [ ] Estratégias de consistência e idempotência

## Status atual

Projeto em estágio inicial, scaffold básico em [NestJS](https://nestjs.com/).

## Stack

| Camada | Tecnologia |
| --- | --- |
| Linguagem | Node.js + TypeScript |
| Framework | NestJS |
| Banco de dados | PostgreSQL + TypeORM |
| Fila / cache | Redis + BullMQ |

## Vídeos assistidos

Lista de vídeos usados como referência durante o desenvolvimento.

- 

## Documentações

Lista de documentações e artigos lidos durante o desenvolvimento.

- [Concurrency-VS-Parallelism](https://www.geeksforgeeks.org/operating-systems/difference-between-concurrency-and-parallelism/)
- [DRY](https://www.geeksforgeeks.org/software-engineering/dont-repeat-yourselfdry-in-software-development/)
- [NestJS](https://docs.nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [TypeORM](https://typeorm.io/)
- [Redis](https://redis.io/docs/latest/)
- [BullMQ](https://docs.bullmq.io/)

## Autor

<div align="center">

Desenvolvido por **Lucas Steffen**

[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/steffen_lucasgabriel/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Lucas-Steffen)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/lucasteffen/)

</div>
