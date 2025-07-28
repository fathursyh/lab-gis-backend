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
        values: ["registered", "checked-in", "cancelled"],
        defaultValue: "registered",
        allowNull: false
    },
}, {
    updatedAt: false,
    createdAt: 'registeredAt'
});

export default Registration;
