# Requirements

[Português](requisitos.md) · [English](requirements.md)

Requirements defined for the project, reviewed as development moves forward. See [Motivation](../README.en.md#motivation) for context on why this domain was chosen.

## Scope

- A single simulated institution: one "bank" with internal accounts and Pix style transfers between its own users, no simulation of multiple participants, SPI or DICT.
- Simplified business rules: account, balance, pix key and basic transfer, no real Pix rules like nighttime limits, MED/refund or multiple key types.

These choices were made to keep the focus on the learning goals (queues, concurrency, immutability) instead of domain or business complexity.

## Functional requirements

- Create account with initial balance.
- Check balance.
- Register pix key (unique string).
- Start transfer (by key or account id).
- Respond to the request right away, without processing it right away (async).
- Process transfer through the queue (debit + credit).
- Check transfer status.
- View account statement.
- Reject transfer with insufficient balance.
- Reprocess a transfer that failed.

## Non functional requirements

- Concurrency without data races.
- Balance consistency (never goes negative).
- Immutability of events (append-only ledger).
- Idempotency on reprocessing.
- Reliable queue (retry + dead-letter queue).
- Observability (logs and queue metrics).
- Horizontal scalability of workers.
- Persistence (Postgres as source of truth).

## Out of scope

- Multiple institutions, SPI, DICT.
- Nighttime limits, MED, refunds.
- Multiple pix key types.

---

Back to [README](../README.en.md).
