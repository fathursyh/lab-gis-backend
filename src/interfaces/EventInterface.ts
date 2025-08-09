import { Model } from "sequelize";

export interface EventInterface extends Model  {
    id?: string,
    title?: string,
    description?: string,
    mentor?: string,
    location?: string,
    startDate?: Date,
    endDate?: Date,
    banner?: string,
    quota?: number
}