import { FlexBox, FlexMessage } from '@line/bot-sdk/dist/types'
import { ISelectedMenu } from '../type'

export class MessageGeneratorServices {
    static receipt(
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
    static predictResult(rawPredictData: any): FlexMessage {
        const scores: Array<number> = rawPredictData.predictions[0].scores
        const labels: Array<string> = rawPredictData.predictions[0].labels
        const body: Array<FlexBox> = labels.map((label, index) => {
            return {
                type: 'box',
                layout: 'horizontal',
                contents: [
                    {
                        type: 'text',
                        text: label,
                        size: 'sm',
                        color: '#555555',
                        flex: 0,
                    },
                    {
                        type: 'text',
                        text: `${scores[index] * 100}%`,
                        size: 'sm',
                        color: '#111111',
                        align: 'end',
                    },
                ],
            }
        })
        return {
            type: 'flex',
            altText: 'Predict result',
            contents: {
                type: 'bubble',
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'text',
                            text: 'Predict result',
                            weight: 'bold',
                            size: 'xxl',
                            margin: 'md',
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
                            contents: body,
                        },
                        {
                            type: 'separator',
                            margin: 'xxl',
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
}
