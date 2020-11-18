import { FlexBox, FlexMessage } from '@line/bot-sdk/dist/types'
import { SCBServices } from '.'
import { Orders } from '../models/order'
import { Restaurants } from '../models/restaurant'
import { Transactions } from '../models/transaction'
import { LineServices } from './line.services'

export class TransactionServices {
    static async getTransaction(transactionId: string) {
        try {
            let databasePayload = await Transactions.findByPk(transactionId)
            if (!databasePayload) return
            return databasePayload?.get()
        } catch (e) {
            throw new Error('cannot transaction id not found')
        }
    }
    static async isPaid(transactionId: string): Promise<boolean> {
        try {
            return SCBServices.isPaid(transactionId)
        } catch (e) {
            throw new Error('cannot get transaction id ' + transactionId)
        }
    }
    static async completeVerified(transactionId: string) {
        try {
            const database = await Transactions.findByPk(transactionId, {
                include: Orders,
            })
            const selectedMenu: Array<ISelectedMenu> = database?.getDataValue(
                'Order'
            ).selectedMenu
            
            const restaurant = await Restaurants.findByPk(
                database?.getDataValue('Order').restaurantId
            )
            await LineServices.sendMessageRaw(
                database?.getDataValue('lineUid'),
                receiptGenerate(
                    transactionId,
                    selectedMenu,
                    restaurant?.getDataValue('name'),
                    restaurant?.getDataValue('address')
                )
            )
            return database?.toJSON()
        } catch (e) {
            throw new Error(e)
        }
    }
}

interface ISelectedMenu {
    img: string
    name: string
    note: string
    unit: number
    price: number
    menuId: string
    pricePerUnit: number
    restaurantId: string
}
function receiptGenerate(
    transactionId: string,
    selectedMenu: Array<ISelectedMenu>,
    restaurantName: string,
    restaurantLocation: string
): FlexMessage {
    let totalPrice: number = 0
    let totalUnit: number = 0
    const body: Array<FlexBox> = selectedMenu.map(
        (i: ISelectedMenu): FlexBox => {
            totalPrice += i.price
            totalUnit += i.unit
            return {
                type: 'box',
                layout: 'horizontal',
                contents: [
                    {
                        type: 'text',
                        text: `${i.name} (${i.unit} หน่วย) `,
                        size: 'sm',
                        color: '#555555',
                        flex: 0,
                    },
                    {
                        type: 'text',
                        text: `฿${i.price.toString()}`,
                        size: 'sm',
                        color: '#111111',
                        align: 'end',
                    },
                ],
            }
        }
    )
    return {
        type: 'flex',
        altText: 'Receipt',
        contents: {
            type: 'bubble',
            body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    {
                        type: 'text',
                        text: 'ใบเสร็จ',
                        weight: 'bold',
                        color: '#1DB446',
                        size: 'sm',
                    },
                    {
                        type: 'text',
                        text: restaurantName,
                        weight: 'bold',
                        size: 'xxl',
                        margin: 'md',
                    },
                    {
                        type: 'text',
                        text: restaurantLocation,
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
                            ...body,
                            {
                                type: 'separator',
                                margin: 'xxl',
                            },
                            {
                                type: 'box',
                                layout: 'horizontal',
                                margin: 'xxl',
                                contents: [
                                    {
                                        type: 'text',
                                        text: 'Unit',
                                        size: 'sm',
                                        color: '#555555',
                                    },
                                    {
                                        type: 'text',
                                        text: totalUnit.toString(),
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
                                        text: 'TOTAL',
                                        size: 'sm',
                                        color: '#555555',
                                    },
                                    {
                                        type: 'text',
                                        text: `฿${totalPrice}`,
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
                                text: transactionId,
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
}
