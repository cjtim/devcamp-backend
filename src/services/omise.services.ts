import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import axios, { AxiosResponse } from 'axios'
import * as omise from 'omise'
import CONST from './../const'
import { Charges, Sources } from 'omise/types/index'
import e from 'express'

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
    static async createPromptPaySource(amount: number): Promise<Sources.ISource> {
        try {
            amount = amount
            const sourcePayload: Sources.ISource = await Omise.sources.create({
                type: 'promptpay',
                amount: amount,
                currency: 'THB',
            })
            return sourcePayload
        } catch (error) {
            throw new Error(' cannot create source Promptpay in Omise ' + error.message)
        }
    }
    static async search(): Promise<AxiosResponse | undefined> {
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
            return payload.data
        } catch (error) {
            console.error(error)
        }
    }
    static async isPaid(chargesId: string): Promise<boolean> {
        try {
            const payload: Charges.ICharge = await Omise.charges.retrieve(chargesId)
            if (payload.paid) {
                return true
            }
        } catch (error) {
            console.log('cannot find isPaid ' + error.message)
        }
        return false
    }
    static async refund(chargesId: string): Promise<Charges.IRefundResponse>  {
        try {
            const chargesDetail: Charges.ICharge = await Omise.charges.retrieve(chargesId)
            const refund: Charges.IRefundResponse = await Omise.charges.createRefund(chargesId, {
                amount: chargesDetail.amount
            })
            return refund
        } catch (error) {
            throw new Error('Cannot refund ' + chargesId + error.message)
        }
    }
    static async getCharge(chargeId: string): Promise<any> {
        try {
            const response: AxiosResponse = await chargeInstance.get('/charges/' + chargeId)
            const chargePayload = response.data
            return chargePayload
        } catch (e) {
            throw new Error('cannot get charge ' + chargeId + e.message)
        }
    }
    static async createCharge(sourceId: string, orderId: string): Promise<any> {
        try {
            const source: AxiosResponse = await chargeInstance.get('/sources/' + sourceId)
            const payload: Charges.IRequest = {
                amount: source.data.amount,
                currency: 'THB',
                return_uri: RETURN_URI + '/' + orderId,
                source: sourceId,
            }
            const response: AxiosResponse = await chargeInstance.post('/charges/', payload)
            const chargePayload = response.data
            return chargePayload
        } catch (error) {
            throw new Error('cannot create Charge from source ' + sourceId + error.message)
        }
    }
    static async createChargeFromToken(cardToken: string, orderId: string, amount: number) {
        try {
            const payload: Charges.IRequest = {
                amount: amount,
                currency: 'THB',
                return_uri: RETURN_URI + '/' + orderId,
                card: cardToken,
            }
            const response: AxiosResponse = await chargeInstance.post('/charges/', payload)
            const chargePayload = response.data
            return chargePayload
        } catch (error) {
            throw new Error('cannot create Charge from cardToken ' + cardToken + error.message)
        }
    }
}
