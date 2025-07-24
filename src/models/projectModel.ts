import { sequelize } from "../config/sequelize";
import { DataTypes } from "sequelize";

const Project = sequelize.define("Project", {
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
});

export default Project;