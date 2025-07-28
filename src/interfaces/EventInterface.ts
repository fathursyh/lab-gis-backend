import { Model } from "sequelize";

export interface EventInterface extends Model  {
    id?: string,
    title?: string,
    description?: string,
    location?: string,
    startDate?: Date,
    endDate?: Date,
    banner?: string,
    quote?: number
}