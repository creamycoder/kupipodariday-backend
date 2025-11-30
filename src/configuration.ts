import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,

  database: {
    type: process.env.DATABASE_TYPE || 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME || 'student',
    password: process.env.DATABASE_PASSWORD || 'student',
    database: process.env.DATABASE_NAME || 'kupipodariday',
    entities: [__dirname + '/../**/*.entity.js'],
    schema: 'public',
    synchronize: true,
  } as PostgresConnectionOptions,

  secretKey: process.env.JWT_SECRET || 'super-strong-secret',
  saltRound: process.env.SALT_ROUND || 10,
});
