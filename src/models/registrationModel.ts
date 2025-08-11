import { sequelize } from "../config/sequelize";
import { DataTypes } from "sequelize";

const Registration = sequelize.define("Registration", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    status: {
        type: DataTypes.ENUM,
        values: ["registered", "checked-in", "passed"],
        defaultValue: "registered",
        allowNull: false
    },
    attendance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    lastQR: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    payments: {
        type: DataTypes.ENUM,
        values: ['UNPAID', 'PAID'],
        defaultValue: 'UNPAID',
        allowNull: false
    },
}, {
    createdAt: 'registeredAt'
});

export default Registration;
