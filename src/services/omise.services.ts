import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import axios from 'axios'
import * as omise from 'omise'

const Omise = omise.default({
    publicKey: process.env.OMISE_PUB_KEY || '',
    secretKey: process.env.OMISE_PRIVATE_KEY || '',
    omiseVersion: '2019-05-29',
})
const HEADERS = {
    authorization: `Basic ${Buffer.from(
        process.env.OMISE_PRIVATE_KEY || ''
    ).toString('base64')}`,
}

const chargeInstance = axios.create({
    baseURL: 'https://api.omise.co/',
    headers: HEADERS,
})
const RETURN_URI = 'https://cjtim.com/pay/success/'
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
                return_uri: RETURN_URI + orderId,
            }
            const charges = await chargeInstance.post('charges', payload)
            return charges.data.authorize_uri
        } catch (error) {
            console.error(error.message)
        }
    }
    static async createTrueMoney(
        amount: number,
        phoneNumber: string,
        orderId: string
    ) {
        amount = amount * 100
        const payload = {
            amount: amount,
            currency: 'THB',
            return_uri: RETURN_URI + orderId,
            source: {
                type: 'truemoney',
                phone_number: phoneNumber,
            },
        }
        const charges = await chargeInstance.post('charges', payload)
        return charges
    }
    static async createBank(
        amount: number,
        bankSource: string,
        orderId: string
    ) {
        try {

            amount = amount * 100
            const payload = {
                amount: amount,
                currency: 'THB',
                return_uri: RETURN_URI + orderId,
                source: {
                    type: 'internet_banking_' + bankSource.toLowerCase(),
                },
            }
            const charges = await chargeInstance.post('charges', payload)
            return charges.data.authorize_uri
        } catch (error) {
            console.error("error in createBank " + error.message)
        }
    }
    static async search() {
        try {
            const payload = await chargeInstance.get(
                'search?filters[status]=successful', {
                    params: {
                        scope: 'charge',
                        query: {
                            description: 'restaurant1'
                        }
                    }
                }
            )
            console.log(payload.data)
            return payload.data
        } catch (error) {
            console.error(error)
        }
    }
    static async isPaid(chargesId: string){
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
                `charges/${chargesId}/refunds/`, {
                    amount: chargesDetail.amount
                }
            )
            return refund.data
        } catch (error) {
            console.error(error.response.data)
        }
    }
}
