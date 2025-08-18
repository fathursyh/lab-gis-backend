import { sequelize } from "../config/sequelize";
import { DataTypes } from "sequelize";

const Certification = sequelize.define("Certification", {
    certificateNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    updatedAt: false,
    indexes: [{unique: true, fields: ['registrationId']}]
});
export default Certification;