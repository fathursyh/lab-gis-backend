import { Sequelize } from "sequelize";


export const sequelize: Sequelize = new Sequelize('lab-gis', 'root', '12345', {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// async function checkConnection() {
//     try {
//         await sequelize.authenticate();
//         console.log('Connection has been established successfully.');
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// }