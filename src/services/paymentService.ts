import axios from "axios";
import "dotenv/config";
import { EventInterface } from "../interfaces/EventInterface";
import { UserInterface } from "../interfaces/UserInterface";
import { PaymentInterface } from "../interfaces/PaymentInterface";
import { Payment } from "../models";

const environment = process.env.ENVIRONMENT;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_BASE_URL = environment === 'DEV' ? 'https://api.sandbox.midtrans.com' : 'https://api.midtrans.com';
const basicAuth = Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64');
const headers = {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": 'application/json'
}

export const paymentService = {
    requestPaymentLink: async (event: EventInterface, userDetail: UserInterface, orderId: string) => {
        const userName = userDetail.fullName.split(' ');
        const payload = {
            transaction_details: {
                order_id: orderId,
                gross_amount: event?.price
            },
            customer_details: {
                first_name: userName[0],
                last_name: userName[1] ?? undefined,
                email: userDetail.email,
                notes: "Terima kasih atas pesanannya. Silahkan ikuti instruksi pembayaran."
            },
            item_details: [
                {
                    id: event?.id,
                    name: event?.title?.slice(0, 40),
                    price: event?.price,
                    quantity: 1
                }
            ],
            usage_limit: 1,
        };
        return await axios(
            `${MIDTRANS_BASE_URL}/v1/payment-links`,
            {
                data: payload,
                method: 'POST',
                headers
            }
        );
    },
    checkPayment: async (registrationId: string) => {
        const payment : PaymentInterface | null = await Payment.findOne({where: {registrationId: registrationId}});
        if (!payment) return false;
        const response =  await axios.get(`${MIDTRANS_BASE_URL}/v1/payment-links/${payment.paymentId}`, {
            headers,
        });
        if (response.status === 404 || response.data.purchases[response.data.purchases.length - 1]?.payment_status !== 'SETTLEMENT') return false;  
        payment.payments = 'PAID';
        await payment.save();
        
        return true;
    }
}