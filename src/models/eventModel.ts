import { sequelize } from "../config/sequelize";
import { DataTypes } from "sequelize";

const Event = sequelize.define("Event", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    mentor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    banner: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    quota: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
});

export default Event;