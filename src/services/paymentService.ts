import axios from "axios";
import { randomUUID } from "crypto";
import "dotenv/config";
import { EventInterface } from "../interfaces/EventInterface";
import { UserInterface } from "../interfaces/UserInterface";

const environment = process.env.ENVIRONMENT;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_BASE_URL = environment === 'DEV' ? 'https://api.sandbox.midtrans.com' : 'https://api.midtrans.com';
const basicAuth = Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64');
const headers = {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": 'application/json'
}

export const paymentService = {
    requestPaymentLink: async (event: EventInterface, userDetail: UserInterface) => {
        const userName = userDetail.fullName.split(' ');
        const payload = {
            transaction_details: {
                order_id: `order-gis-${event?.id?.slice(0, 6)}-${randomUUID().slice(0, 6)}`,
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
            expiry: {
                duration: 2,
                unit: 'days'
            }
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
    checkPayment: async (orderId: string) => {
        const response =  await axios.get(`${MIDTRANS_BASE_URL}/v2/${orderId}/status`, {
            headers,
        });
        if (response.status === 404 || response.data.transaction_status !== 'settlement') return {
            transactionId: response.data.transaction_id,
            orderId: orderId,
            paid: false,
            price: response.data.gross_amount,
        }
        return {
            transactionId: response.data.transaction_id,
            orderId: orderId,
            paid: true,
            price: response.data.gross_amount,
        }
    }
}