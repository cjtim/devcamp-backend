import axios from 'axios'
import CONST from './../const'
import { FlexBox, FlexMessage } from '@line/bot-sdk/dist/types'
export class ImageClassifyServices {
    static async getPredict(imageBinary: Buffer): Promise<any> {
        try {
            const host = CONST.IMAGE_CLASSIFY_URL
            const strBase64 = Buffer.from(imageBinary).toString('base64')
            const response = await axios.post(host, {
                instances: [
                    {
                        image_bytes: {
                            b64: strBase64,
                        },
                        key: 'justRandomImage',
                    },
                ],
            })
            return response.data
        } catch (e) {
            throw e
        }
    }
    static resultToLineFlexMsg(rawPredictData: any): FlexMessage {
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
