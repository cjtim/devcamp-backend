import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import CONST from './../const'

const HEADERS = {
    'content-type': 'application/json',
    'accept-language': 'EN',
    'response-channel': 'mobile',
    apikey: CONST.SCB_PUB_KEY,
    resourceOwnerId: CONST.SCB_PUB_KEY,
    apisecret: CONST.SCB_PRI_KEY,
    endState: 'mobile_app',
    channel: 'scbeasy',
}
const GET_TOKEN_API = CONST.SCB_GET_TOKEN_API
const DEEPLINK_API = CONST.SCB_DEEPLINK_API
const TRANSACTION_API = CONST.SCB_TRANSACTION_API
export class SCBServices {
    static async getToken(requestUID?: string) {
        const getToken = await axios.post(
            GET_TOKEN_API,
            {
                applicationKey: CONST.SCB_PUB_KEY,
                applicationSecret: CONST.SCB_PRI_KEY,
            },
            { headers: { ...HEADERS, requestUId: requestUID } }
        )
        return getToken.data.data.accessToken
    }
    static async createLink(amount: number) {
        try {
            const requestUID = uuidv4()
            const orderId = requestUID.slice(0, 8)
            const accessToken = await this.getToken(requestUID)

            const orderPayload = {
                transactionType: 'PURCHASE',
                transactionSubType: ['BP', 'CCFA'],
                sessionValidityPeriod: 60 * 5, // 5 Minute
                billPayment: {
                    paymentAmount: amount,
                    accountTo: '614124404251826',
                    ref1: 'ABCDEFGHIJ1234567890',
                    ref2: 'ABCDEFGHIJ1234567890',
                    ref3: orderId,
                },
                creditCardFullAmount: {
                    merchantId: '349346660382053',
                    terminalId: '880847411208176',
                    orderReference: orderId,
                    paymentAmount: amount,
                },
                merchantMetaData: {
                    // callbackUrl: callbackUrl,
                    merchantInfo: {
                        name: 'TestMerchant1601835607',
                    },
                },
            }
            const scbEndPoint = await axios.post(DEEPLINK_API, orderPayload, {
                headers: {
                    ...HEADERS,
                    requestUId: requestUID,
                    authorization: `Bearer ${accessToken}`,
                },
            })
            const callbackUrl = CONST.PAYMENT_RETURN_URL + '/' + scbEndPoint.data.data.transactionId
            const deeplinkUrl = scbEndPoint.data.data.deeplinkUrl + "?callback_url=" + callbackUrl
            const response = {
                transactionId: scbEndPoint.data.data.transactionId,
                deeplinkUrl:  deeplinkUrl,
                orderId: orderId,
                requestUId: requestUID
            }
            return response
        } catch (error) {
            console.log(error.message)
        }
    }
    static async get(tranactionId: string) {
        try {
            const requestUID = uuidv4()
            const accessToken = await this.getToken(requestUID)
            const payload = await axios.get(
                TRANSACTION_API + `/${tranactionId}`,
                {
                    headers: {
                        ...HEADERS,
                        requestUId: requestUID,
                        authorization: `Bearer ${accessToken}`,
                    },
                }
            )
            return payload.data
        } catch (e)  {
            throw new Error('Cannot get transaction id ' + tranactionId)
        }
    }
    static async isPaid(tranactionId: string): Promise<boolean> {
        try {
            const transaction = await this.get(tranactionId)
            if (transaction.data.statusCode === 1) {
                return true
            }
        } catch (e) {
            throw new Error('cannot verify isPaid ' + e.message)
        }
        return false
    }
}
