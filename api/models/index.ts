import configdb from "../config/db.config.js";
import { Sequelize } from "sequelize";
import User from "./User.js";
import pg from "pg";

const useSsl = process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production' || (configdb.HOST !== 'localhost' && configdb.HOST !== '127.0.0.1');

const sequelize = new Sequelize(
    configdb.DB,
    configdb.USER,
    configdb.PASSWORD,
    {
        host: configdb.HOST,
        port: configdb.PORT ? Number(configdb.PORT) : undefined,
        dialect: configdb.dialect,
        dialectModule: pg,
        pool: {
            max: configdb.pool.max,
            min: configdb.pool.min,
            acquire: configdb.pool.acquire,
            idle: configdb.pool.idle,
            evict: configdb.pool.evict
        },
        dialectOptions: useSsl ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        } : undefined,
    }
);

const db: any = {Sequelize, sequelize, users: {}};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = User(sequelize, Sequelize);

export default db;