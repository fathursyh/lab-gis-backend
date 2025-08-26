import { Model } from "sequelize";

export interface RegistrationInterface extends Model {
    id?: string,
    status?: 'registered' | 'passed' | 'checked-in',
    registeredAt?: Date,
    updatedAt?: Date,
    userId?: string,
    eventId?: string,
    attendance?: number,
    lastQR?: string,
}