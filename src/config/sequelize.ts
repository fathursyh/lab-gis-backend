import { Sequelize } from "sequelize";
import 'dotenv/config';

export const sequelize: Sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASS, {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export const syncDatabase =  async() => {
    await sequelize.sync();
    console.log('Database synced.')
}

syncDatabase();