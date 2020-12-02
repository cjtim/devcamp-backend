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
        const body = selectedMenu.map(
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

    static cancelOrder(orderId: number , tipForCustomer : string): FlexMessage {
        return {
            type: 'flex',
            altText: 'Receipt',
            contents: {
                type: 'bubble',
                header: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'box',
                            layout: 'horizontal',
                            contents: [
                                {
                                    type: 'image',
                                    url:
                                        'https://cdn2.iconfinder.com/data/icons/bitsies/128/Cancel-512.png',
                                    size: 'full',
                                    aspectMode: 'fit',
                                    aspectRatio: '190:196',
                                    gravity: 'center',
                                    flex: 1,
                                    offsetStart: 'md'
                                },
                                    
                                {
                                    type: 'box',
                                    layout: 'horizontal',
                                    contents: [
                                        {
                                            type: 'text',
                                            text: 'ORDER ' + orderId,
                                            size: 'xs',
                                            color: '#ffffff',
                                            align: 'center',
                                            gravity: 'center',
                                        },
                                    ],
                                    backgroundColor: '#EC3D44',
                                    paddingAll: '2px',
                                    paddingStart: '4px',
                                    paddingEnd: '4px',
                                    flex: 0,
                                    position: 'absolute',
                                    offsetStart: '18px',
                                    offsetTop: '18px',
                                    cornerRadius: '100px',
                                    width: '90px',
                                    height: '25px',
                                },
                            ],
                        },
                    ],
                    paddingAll: '0px',
                },
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                                {
                                    type: 'box',
                                    layout: 'vertical',
                                    contents: [
                                        {
                                            type: 'text',
                                            contents: [],
                                            size: 'xl',
                                            wrap: true,
                                            text: 'ออเดอร์ถูกยกเลิก',
                                            color: '#ffffff',
                                            weight: 'bold',
                                        },
                                    ],
                                    spacing: 'sm',
                                },
                                {
                                    type: 'box',
                                    layout: 'vertical',
                                    contents: [
                                        {
                                            type: 'box',
                                            layout: 'vertical',
                                            contents: [
                                                {
                                                    type: 'text',
                                                    contents: [],
                                                    size: 'sm',
                                                    wrap: true,
                                                    margin: 'lg',
                                                    color: '#ffffffde',
                                                    text:
                                                        tipForCustomer,
                                                },
                                            ],
                                        },
                                    ],
                                    paddingAll: '13px',
                                    backgroundColor: '#ffffff1A',
                                    cornerRadius: '2px',
                                    margin: 'xl',
                                },
                            ],
                        },
                    ],
                    paddingAll: '20px',
                    backgroundColor: '#464F69',
                },
            },
        }
    }


    static completeOrder(orderId: number , tipForCustomer : string): FlexMessage {
        return {
            type: 'flex',
            altText: 'Receipt',
            contents: {
                type: 'bubble',
                header: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'box',
                            layout: 'horizontal',
                            contents: [
                                {
                                    type: 'image',
                                    url:
                                        'https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/shrimp-fried-rice-food-dish-512.png',
                                    size: 'full',
                                    aspectMode: 'fit',
                                    aspectRatio: '190:196',
                                    gravity: 'center',
                                    flex: 1,
                                    offsetStart: 'md'
                                },
                                    
                                {
                                    type: 'box',
                                    layout: 'horizontal',
                                    contents: [
                                        {
                                            type: 'text',
                                            text: 'ORDER ' + orderId,
                                            size: 'xs',
                                            color: '#ffffff',
                                            align: 'center',
                                            gravity: 'center',
                                        },
                                    ],
                                    backgroundColor: '#EC3D44',
                                    paddingAll: '2px',
                                    paddingStart: '4px',
                                    paddingEnd: '4px',
                                    flex: 0,
                                    position: 'absolute',
                                    offsetStart: '18px',
                                    offsetTop: '18px',
                                    cornerRadius: '100px',
                                    width: '90px',
                                    height: '25px',
                                },
                            ],
                        },
                    ],
                    paddingAll: '0px',
                },
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                                {
                                    type: 'box',
                                    layout: 'vertical',
                                    contents: [
                                        {
                                            type: 'text',
                                            contents: [],
                                            size: 'xl',
                                            wrap: true,
                                            text: 'ขอบคุณที่อุดหนุน ทานอาหารให้อร่อยครับ',
                                            color: '#ffffff',
                                            weight: 'bold',
                                        },
                                    ],
                                    spacing: 'sm',
                                },
                                {
                                    type: 'box',
                                    layout: 'vertical',
                                    contents: [
                                        {
                                            type: 'box',
                                            layout: 'vertical',
                                            contents: [
                                                {
                                                    type: 'text',
                                                    contents: [],
                                                    size: 'sm',
                                                    wrap: true,
                                                    margin: 'lg',
                                                    color: '#ffffffde',
                                                    text:
                                                        tipForCustomer,
                                                },
                                            ],
                                        },
                                    ],
                                    paddingAll: '13px',
                                    backgroundColor: '#ffffff1A',
                                    cornerRadius: '2px',
                                    margin: 'xl',
                                },
                            ],
                        },
                    ],
                    paddingAll: '20px',
                    backgroundColor: '#464F69',
                },
            },
        }
    }

    static cookingOrder(orderId: number , tipForCustomer : string): FlexMessage {
        return {
            type: 'flex',
            altText: 'Receipt',
            contents: {
                type: 'bubble',
                header: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'box',
                            layout: 'horizontal',
                            contents: [
                                {
                                    type: 'image',
                                    url:
                                        'https://cdn2.iconfinder.com/data/icons/people-at-home-scenes/64/cooking-512.png',
                                    size: 'full',
                                    aspectMode: 'fit',
                                    aspectRatio: '190:196',
                                    gravity: 'center',
                                    flex: 1,
                                    offsetStart: 'md'
                                },
                                    
                                {
                                    type: 'box',
                                    layout: 'horizontal',
                                    contents: [
                                        {
                                            type: 'text',
                                            text: 'ORDER ' + orderId,
                                            size: 'xs',
                                            color: '#ffffff',
                                            align: 'center',
                                            gravity: 'center',
                                        },
                                    ],
                                    backgroundColor: '#EC3D44',
                                    paddingAll: '2px',
                                    paddingStart: '4px',
                                    paddingEnd: '4px',
                                    flex: 0,
                                    position: 'absolute',
                                    offsetStart: '18px',
                                    offsetTop: '18px',
                                    cornerRadius: '100px',
                                    width: '90px',
                                    height: '25px',
                                },
                            ],
                        },
                    ],
                    paddingAll: '0px',
                },
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                                {
                                    type: 'box',
                                    layout: 'vertical',
                                    contents: [
                                        {
                                            type: 'text',
                                            contents: [],
                                            size: 'xl',
                                            wrap: true,
                                            text: 'ร้านกำลังจัดเตรียมอาหาร ให้กับคุณ',
                                            color: '#ffffff',
                                            weight: 'bold',
                                        },
                                        {
                                            type: 'text',
                                            text: 'กรุณารอสักครู่',
                                            color: '#ffffffcc',
                                            size: 'sm',
                                        },
                                    ],
                                    spacing: 'sm',
                                },
                                {
                                    type: 'box',
                                    layout: 'vertical',
                                    contents: [
                                        {
                                            type: 'box',
                                            layout: 'vertical',
                                            contents: [
                                                {
                                                    type: 'text',
                                                    contents: [],
                                                    size: 'sm',
                                                    wrap: true,
                                                    margin: 'lg',
                                                    color: '#ffffffde',
                                                    text:
                                                        tipForCustomer,
                                                },
                                            ],
                                        },
                                    ],
                                    paddingAll: '13px',
                                    backgroundColor: '#ffffff1A',
                                    cornerRadius: '2px',
                                    margin: 'xl',
                                },
                            ],
                        },
                    ],
                    paddingAll: '20px',
                    backgroundColor: '#464F69',
                },
            },
        }
    }


    static updateOrder(orderId: number, summaryOrder: string , summaryFoodName : string): FlexMessage {
        return {
            type: 'flex',
            altText: 'Receipt',
            contents: {
                type: 'bubble',
                header: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'box',
                            layout: 'horizontal',
                            contents: [
                                {
                                    type: 'image',
                                    url:
                                        'https://cdn0.iconfinder.com/data/icons/food-delivery-26/512/take_away-hold-give-bag-512.png',
                                    size: 'full',
                                    aspectMode: 'fit',
                                    aspectRatio: '190:196',
                                    gravity: 'center',
                                    flex: 1,
                                    offsetStart: 'md'
                                },
                                    
                                {
                                    type: 'box',
                                    layout: 'horizontal',
                                    contents: [
                                        {
                                            type: 'text',
                                            text: 'ORDER ' + orderId,
                                            size: 'xs',
                                            color: '#ffffff',
                                            align: 'center',
                                            gravity: 'center',
                                        },
                                    ],
                                    backgroundColor: '#EC3D44',
                                    paddingAll: '2px',
                                    paddingStart: '4px',
                                    paddingEnd: '4px',
                                    flex: 0,
                                    position: 'absolute',
                                    offsetStart: '18px',
                                    offsetTop: '18px',
                                    cornerRadius: '100px',
                                    width: '90px',
                                    height: '25px',
                                },
                            ],
                        },
                    ],
                    paddingAll: '0px',
                },
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                                {
                                    type: 'box',
                                    layout: 'vertical',
                                    contents: [
                                        {
                                            type: 'text',
                                            contents: [],
                                            size: 'xl',
                                            wrap: true,
                                            text: 'อาหารของคุณพร้อมแล้ว',
                                            color: '#ffffff',
                                            weight: 'bold',
                                        },
                                        {
                                            type: 'text',
                                            text: summaryOrder,
                                            color: '#ffffffcc',
                                            size: 'sm',
                                        },
                                    ],
                                    spacing: 'sm',
                                },
                                {
                                    type: 'box',
                                    layout: 'vertical',
                                    contents: [
                                        {
                                            type: 'box',
                                            layout: 'vertical',
                                            contents: [
                                                {
                                                    type: 'text',
                                                    contents: [],
                                                    size: 'sm',
                                                    wrap: true,
                                                    margin: 'lg',
                                                    color: '#ffffffde',
                                                    text:
                                                        summaryFoodName,
                                                },
                                            ],
                                        },
                                    ],
                                    paddingAll: '13px',
                                    backgroundColor: '#ffffff1A',
                                    cornerRadius: '2px',
                                    margin: 'xl',
                                },
                            ],
                        },
                    ],
                    paddingAll: '20px',
                    backgroundColor: '#464F69',
                },
            },
        }
    }
}
