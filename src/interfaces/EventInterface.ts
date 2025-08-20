import { Model } from "sequelize";

export interface EventInterface extends Model  {
    id?: string,
    title?: string,
    description?: string,
    mentor?: string,
    onlineLocation?: string,
    location?: string,
    registerDate?: Date,
    startDate?: Date,
    endDate?: Date,
    banner?: string,
    quota?: number,
    duration?: number,
    price?: number,
    currentCode?: string,
    endRegisterDate?: boolean,
}