import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import axios from 'axios'
import * as omise from 'omise'
import CONST from './../const'

const Omise = omise.default({
    publicKey: CONST.OMISE_PUB_KEY,
    secretKey: CONST.OMISE_PRI_KEY,
    omiseVersion: '2019-05-29',
})
const HEADERS = {
    authorization: `Basic ${Buffer.from(CONST.OMISE_PRI_KEY).toString(
        'base64'
    )}`,
}

const chargeInstance = axios.create({
    baseURL: CONST.OMISE_API_URL,
    headers: HEADERS,
})
const RETURN_URI = CONST.PAYMENT_RETURN_URL
export default class OmiseServices {
    static async createPromptPay(amount: number, orderId: string) {
        try {
            amount = amount * 100
            const payload = {
                amount: amount,
                currency: 'THB',
                source: {
                    type: 'promptpay',
                    amount: amount,
                    currency: 'THB',
                },
                description: 'restaurant1',
                return_uri: RETURN_URI + '/' + orderId,
            }
            const charges = await chargeInstance.post('/charges', payload)
            return charges.data.authorize_uri
        } catch (error) {
            console.error(error.message)
        }
    }
    static async search() {
        try {
            const payload = await chargeInstance.get(
                '/search?filters[status]=successful',
                {
                    params: {
                        scope: 'charge',
                        query: {
                            description: 'restaurant1',
                        },
                    },
                }
            )
            console.log(payload.data)
            return payload.data
        } catch (error) {
            console.error(error)
        }
    }
    static async isPaid(chargesId: string) {
        try {
            const payload = await Omise.charges.retrieve(chargesId)
            if (payload.paid) {
                return true
            }
        } catch (error) {
            console.error(error.message)
        }
        return false
    }
    static async refund(chargesId: string) {
        try {
            const chargesDetail = await Omise.charges.retrieve(chargesId)
            const refund = await chargeInstance.post(
                `/charges/${chargesId}/refunds/`,
                {
                    amount: chargesDetail.amount,
                }
            )
            return refund.data
        } catch (error) {
            console.error(error.response.data)
        }
    }
    static async getCharge(chargeId: string) {
        try {
            const chargePayload = await chargeInstance.get('/charges/' + chargeId)
            return chargePayload.data
        } catch (e) {
            throw new Error('cannot get charge ' + chargeId + e.message)
        }
    }
    static async createCharge(sourceId: string, orderId: string) {
        try {
            const source = await chargeInstance.get('/sources/' + sourceId)
            const payload = {
                amount: source.data.amount,
                currency: 'THB',
                return_uri: RETURN_URI + '/' + orderId,
                source: sourceId,
            }
            const charge = await chargeInstance.post('/charges/', payload)
            return { ...charge.data, payment_url: charge.data.authorize_uri }
        } catch (error) {
            console.error(error.message)
        }
    }
    static async chargeCreditCard(token: string, amount: number) {}
}
