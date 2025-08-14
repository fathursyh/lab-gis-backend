import { Model } from "sequelize";

export interface PaymentInterface extends Model {
    payments?: "UNPAID" | "PAID";
    paymentId?: string;
    paymentLink?: string;
}
