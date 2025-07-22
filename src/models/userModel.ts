import { sequelize } from "../config/sequelize";
import { DataTypes } from "sequelize";
import bcrypt from 'bcryptjs';

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            }
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
            set(value: string) {
                this.setDataValue('password', bcrypt.hashSync(value, 10));
            }
        },
    },
);
// User.sync();
export function validatePassword(password: string, userPassword: string) {
    return bcrypt.compare(password, userPassword);
}
export default User;

// User.findOne({where: {email: 'fathur@gmail.com'}}).then(data => console.log(data?.dataValues.password));