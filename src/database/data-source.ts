import { DataSource } from 'typeorm';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  synchronize: false,
});
