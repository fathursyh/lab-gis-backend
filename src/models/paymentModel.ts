import { sequelize } from "../config/sequelize";
import { DataTypes } from "sequelize";

const Payment = sequelize.define("Payment", {
    payments: {
        type: DataTypes.ENUM,
        values: ['UNPAID', 'PAID'],
        defaultValue: 'UNPAID',
        allowNull: false
    },
    paymentId: {
        type: DataTypes.STRING(40),
        allowNull: true,
    },
    paymentLink: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    indexes: [{ unique: true, fields: ['registrationId'] }]
});
export default Payment;