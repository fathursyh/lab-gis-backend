import { sequelize } from "../config/sequelize";
import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";

const User = sequelize.define("User", {
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
        },
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
        set(value: string) {
            this.setDataValue("password", bcrypt.hashSync(value, 10));
        },
        validate: {
            min: 8
        }
    },
    role: {
        type: DataTypes.ENUM,
        values: ["member", "admin"],
        defaultValue: "member",
        allowNull: false,
        validate: {
            isIn: {
                // check role
                args: [["member", "admin"]],
                msg: "Role must be member or admin.",
            },
        },
    },
});
// User.sync();
export function validatePassword(password: string, userPassword: string) {
    return bcrypt.compare(password, userPassword);
}
export default User;

// User.findOne({where: {email: 'fathur@gmail.com'}}).then(data => console.log(data?.dataValues.password));
