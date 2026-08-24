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
- [Documentação do projeto](#documentação-do-projeto)
- [Autor](#autor)

## Motivação

O objetivo aqui não é construir um produto financeiro real, e sim usar o domínio do Pix como pretexto pra estudar problemas de engenharia que aparecem em sistemas de alta escala:

- Processamento de milhares de requisições: como lidar com grande volume de transações chegando ao mesmo tempo.
- Sistemas de fila: desacoplar o recebimento de uma solicitação de transferência do seu processamento efetivo.
- Concorrência vs. paralelismo: entender a diferença na prática e onde cada abordagem se aplica ao processar transações financeiras.
- Imutabilidade: modelar transferências, débitos e créditos como eventos imutáveis, evitando estados mutáveis compartilhados que geram condição de corrida.
- Como o Pix funciona por baixo dos panos: entender, na medida do possível, os fluxos e garantias que tornam o Pix uma tecnologia confiável e reconhecida internacionalmente.

## Documentação do projeto

- [Requisitos](docs/requisitos.md): escopo, requisitos funcionais e não funcionais.
- [Arquitetura](docs/arquitetura.md): stack e decisões técnicas.
- [Planejamento](docs/planejamento.md): status atual e roadmap.
- [Lógicas](docs/logicas.md): conceitos de engenharia estudados, vídeos e leituras de referência.

## Autor

<div align="center">

Desenvolvido por **Lucas Steffen**

[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/steffen_lucasgabriel/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Lucas-Steffen)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/lucasteffen/)

</div>
