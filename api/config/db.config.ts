import { Dialect } from 'sequelize/types';

const dbConfig = {
  HOST: process.env.POSTGRES_HOST || 'localhost',
  USER: process.env.POSTGRES_USER || 'postgres',
  PASSWORD: process.env.POSTGRES_PASSWORD || 'postgres',
  DB: process.env.POSTGRES_DB || 'postgres',

  

  PORT: process.env.POSTGRES_PORT || 5432,
  dialect: (process.env.DB_DIALECT as Dialect) || 'postgres',
  pool: {
    max: 2,
    min: 0,
    acquire: 3000,
    idle: 0,
    evict: 8000
  }
};

export default dbConfig;
