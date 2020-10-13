import DatabaseServices from './database.services'
import OmiseServices from './omise.services'
import { v4 as uuidv4 } from 'uuid'
import LineService from './line.services'
import { FlexMessage } from '@line/bot-sdk/dist/types'
import { Charges, Sources } from 'omise'

export default class PaymentServices {
    static async createCharge(userId: string, sourceId: string) {
        // create Omise charge
        // save charges payload, userId to database
        // return charge
        try {
            const orderId = uuidv4()
            const chargePayload: any = await OmiseServices.createCharge(
                sourceId,
                orderId
            )
            const databasePayload = await DatabaseServices.saveChargePayload(userId, chargePayload)
            return databasePayload
        } catch (e) {
            throw new Error('Cannot create order ' + e.message)
        }
    }
    static async createPromptPay(userId: string, amount: number) {
        // create promptpay source
        // create charge
        // save to database
        try {
            const orderId = uuidv4()
            const sourcePayload: Sources.ISource = await OmiseServices.createPromptPaySource(amount)
            const chargePayload: any = await this.createCharge(sourcePayload.id, orderId)
            const databasePayload = await DatabaseServices.saveChargePayload(chargePayload, userId)
            return databasePayload
        } catch (e) {
            throw new Error('cannot create PromptPay ' + e.message)
        }
    }
    static async userCompleteOrder(chargeId: string) {
        try {
            const chargePayload: Charges.ICharge = await OmiseServices.getCharge(
                chargeId
            )
            if (chargePayload.paid) {
                const databasePayload = await DatabaseServices.saveChargePayload(chargePayload)
                const orderId: string = databasePayload.orderId
                await LineService.sendMessageRaw(
                    databasePayload.userId,
                    flexRecipe
                )
            }
        } catch (e) {
            throw new Error('Cannot verify userCompleteOrder ' + e.message)
        }
    }
}
const flexRecipe: FlexMessage = {
    type: 'flex',
    altText: 'Transaction Complete',
    contents: {
        type: 'bubble',
        body: {
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'text',
                    text: 'RECEIPT',
                    weight: 'bold',
                    color: '#1DB446',
                    size: 'sm',
                },
                {
                    type: 'text',
                    text: 'Brown Store',
                    weight: 'bold',
                    size: 'xxl',
                    margin: 'md',
                },
                {
                    type: 'text',
                    text: 'Miraina Tower, 4-1-6 Shinjuku, Tokyo',
                    size: 'xs',
                    color: '#aaaaaa',
                    wrap: true,
                },
                {
                    type: 'separator',
                    margin: 'xxl',
                },
                {
                    type: 'box',
                    layout: 'vertical',
                    margin: 'xxl',
                    spacing: 'sm',
                    contents: [
                        {
                            type: 'box',
                            layout: 'horizontal',
                            contents: [
                                {
                                    type: 'text',
                                    text: 'Chewing Gum',
                                    size: 'sm',
                                    color: '#555555',
                                    flex: 0,
                                },
                                {
                                    type: 'text',
                                    text: '$0.99',
                                    size: 'sm',
                                    color: '#111111',
                                    align: 'end',
                                },
                            ],
                        },
                        {
                            type: 'box',
                            layout: 'horizontal',
                            contents: [
                                {
                                    type: 'text',
                                    text: 'Bottled Water',
                                    size: 'sm',
                                    color: '#555555',
                                    flex: 0,
                                },
                                {
                                    type: 'text',
                                    text: '$3.33',
                                    size: 'sm',
                                    color: '#111111',
                                    align: 'end',
                                },
                            ],
                        },
                        {
                            type: 'separator',
                            margin: 'xxl',
                        },
                        {
                            type: 'box',
                            layout: 'horizontal',
                            contents: [
                                {
                                    type: 'text',
                                    text: 'TOTAL',
                                    size: 'sm',
                                    color: '#555555',
                                },
                                {
                                    type: 'text',
                                    text: '$7.31',
                                    size: 'sm',
                                    color: '#111111',
                                    align: 'end',
                                },
                            ],
                        },
                    ],
                },
                {
                    type: 'separator',
                    margin: 'xxl',
                },
                {
                    type: 'box',
                    layout: 'horizontal',
                    margin: 'md',
                    contents: [
                        {
                            type: 'text',
                            text: 'PAYMENT ID',
                            size: 'xs',
                            color: '#aaaaaa',
                            flex: 0,
                        },
                        {
                            type: 'text',
                            text: '#743289384279',
                            color: '#aaaaaa',
                            size: 'xs',
                            align: 'end',
                        },
                    ],
                },
            ],
        },
        styles: {
            footer: {
                separator: true,
            },
        },
    },
}
