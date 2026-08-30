import 'dotenv/config';
import { DataSource } from 'typeorm';
import { KmsService } from 'src/kms/kms.service';
import { normalizeValue, tokenizeName } from 'src/shared/utils/normalize.util';

// One-off backfill for the AddPiiEncryptionToUsers migration: encrypts the
// still-present plaintext name/email/phone columns and populates
// piiCiphertext/dataKeyCiphertext/emailBlindIndex/phoneBlindIndex plus the
// user_search_tokens rows. Run with ts-node after that migration and before
// DropPlaintextPiiFromUsers:
//   npx ts-node -r tsconfig-paths/register src/database/scripts/backfill-user-pii.script.ts

interface PlaintextUserRow {
  id: string;
  name: string;
  email: string;
  phone: string;
}

async function main() {
  const dataSource = new DataSource({
    type: process.env.DB_TYPE as 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  await dataSource.initialize();

  const kmsService = new KmsService();

  const rows: PlaintextUserRow[] = await dataSource.query(
    `SELECT id, name, email, phone FROM users WHERE "emailBlindIndex" IS NULL`,
  );

  console.log(`Backfilling ${rows.length} user row(s)...`);

  for (const row of rows) {
    const { plaintextKey, encryptedKey } = await kmsService.generateDataKey();
    const piiCiphertext = kmsService.encryptPayload(
      { name: row.name, email: row.email, phone: row.phone },
      plaintextKey,
    );
    const emailBlindIndex = await kmsService.generateMac(
      normalizeValue(row.email),
    );
    const phoneBlindIndex = await kmsService.generateMac(
      normalizeValue(row.phone),
    );
    const tokens = tokenizeName(row.name);
    const tokenHashes = await Promise.all(
      tokens.map((token) => kmsService.generateMac(token)),
    );

    await dataSource.transaction(async (manager) => {
      await manager.query(
        `UPDATE users SET "piiCiphertext" = $1, "dataKeyCiphertext" = $2, "emailBlindIndex" = $3, "phoneBlindIndex" = $4 WHERE id = $5`,
        [
          piiCiphertext,
          encryptedKey.toString('base64'),
          emailBlindIndex,
          phoneBlindIndex,
          row.id,
        ],
      );

      for (const tokenHash of tokenHashes) {
        await manager.query(
          `INSERT INTO user_search_tokens ("userId", "tokenHash") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [row.id, tokenHash],
        );
      }
    });

    console.log(`  backfilled user ${row.id}`);
  }

  await dataSource.destroy();
  console.log('Done.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
