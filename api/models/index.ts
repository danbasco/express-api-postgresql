import configdb from "../config/db.config.js";
import { Sequelize } from "sequelize";
import User from "./User.js";
import pg from "pg";

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
    }
);

const db: any = {Sequelize, sequelize, users: {}};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = User(sequelize, Sequelize);

export default db;