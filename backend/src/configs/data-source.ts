import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

export default new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT) || 3306,
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '1234',
  database: process.env.MYSQL_DATABASE || 'snapp',
  synchronize: false,
  entities: ['dist/**/**/**/*.entity{.ts,.js}', 'dist/**/**/*.entity{.ts,.js}'],
  dropSchema: false,
  logging: false,
  logger: 'file',
});
