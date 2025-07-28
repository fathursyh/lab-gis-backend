import { Model } from "sequelize";

export interface UserInterface extends Model {
    id: string,
    email: string,
    fullName: string,
}