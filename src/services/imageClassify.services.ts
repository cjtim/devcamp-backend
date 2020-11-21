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
}
