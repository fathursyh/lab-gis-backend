import { Model } from "sequelize";

export interface RegistrationInterface extends Model {
    id?: string,
    status?: 'registered' | 'cancelled' | 'checked-in',
    registeredAt?: Date,
    userId?: string,
    eventId?: string,
    attendance?: number,
    lastQR?: string,
}