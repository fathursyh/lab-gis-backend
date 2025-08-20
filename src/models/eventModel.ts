import { sequelize } from "../config/sequelize";
import { DataTypes } from "sequelize";
import dayjs from 'dayjs'

const Event = sequelize.define("Event", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    mentor: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    onlineLocation: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    registerDate: {
        type: DataTypes.DATEONLY,
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
        type: DataTypes.TINYINT,
        defaultValue: 0,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    currentCode: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    duration: {
        type: DataTypes.VIRTUAL,
        get() {
            return dayjs((this as any).endDate).diff((this as any).startDate, 'd') + 1;
        }
    },
    endRegisterDate: {
        type: DataTypes.VIRTUAL,
        get() {
            //? end register day is day-1 of start date
            return dayjs((this as any).startDate).diff(dayjs().format('YYYY-MM-DD'), 'day') === 0
        }
    }
});

export default Event;