import { FlexMessage } from '@line/bot-sdk/dist/types'
import { Sources } from 'omise'
import { PAYMENT_METHOD } from '../enum'
import { Orders } from '../models/order'
import { Transactions } from '../models/transaction'
import { LineServices } from './line.services'
import { OmiseServices } from './omise.services'

export class TransactionServices {
    static async create(
        method: PAYMENT_METHOD,
        payAmount: number,
        orderId: string,
        lineUid: string,
        sourceId: string
    ) {
        try {
            let response: any
            if (method === PAYMENT_METHOD.SCB_EASY) {
                response = await Transactions.create({
                    method: method,
                    amount: payAmount,
                    orderId: orderId,
                    lineUid: lineUid,
                })
            }
            else if (method === PAYMENT_METHOD.OMISE) {
                let chargePayload: any
                if (sourceId.startsWith('tokn')) {
                    chargePayload = await OmiseServices.createChargeFromToken(
                        sourceId,
                        orderId,
                        payAmount
                    )
                } else {
                    chargePayload = await OmiseServices.createCharge(
                        sourceId,
                        orderId
                    )
                }
                const response = await Transactions.create({
                    method: method,
                    amount: payAmount,
                    orderId: orderId,
                    chargeId: chargePayload.id,
                    lineUid: lineUid,
                })
                if (chargePayload.status === 'failed') {
                    LineServices.sendMessage(
                        lineUid,
                        'Sorry your credit card has been reject'
                    )
                } else if (
                    chargePayload.status === 'successful' &&
                    chargePayload.paid
                ) {
                    LineServices.sendMessageRaw(lineUid, flexRecipe)
                }
                return { ...response, ...chargePayload }
            }
            return response
        } catch (e) {
            throw new Error('cannot create transaction ' + e.message)
        }
    }
   
    static async getTransaction(transactionId: string) {
        try {
            let databasePayload = await Transactions.findOne({
                where: {
                    transactionId: transactionId,
                },
            })
            if (databasePayload?.getDataValue('method') === 'OMISE') {
                const newCharge = await OmiseServices.getCharge(databasePayload.getDataValue('chargeId'))
                databasePayload.setDataValue('paid', newCharge.paid)
            }
            databasePayload?.save()
            return databasePayload?.get()
        } catch (e) {
            throw new Error('cannot transaction id not found')
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
