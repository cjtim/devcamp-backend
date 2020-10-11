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
            console.log('requestUID ' + requestUID)
            const orderId = requestUID.slice(0, 8)
            const callbackUrl = CONST.PAYMENT_RETURN_URL + '/' + orderId
            const accessToken = await this.getToken(requestUID)
            console.log('AccessToken ' + accessToken)

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
                    callbackUrl: callbackUrl,
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
            console.log(scbEndPoint.data.data)
        } catch (error) {
            console.log(error.message)
        }
    }
    static async isPaid(tranactionId: string): Promise<boolean> {
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
            console.log(payload.data.data)
            if (payload.data.data.statusCode === 1) {
                return true
            }
        } catch (error) {
            console.error(error.message)
        }
        return false
    }
}
