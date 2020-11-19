import axios from 'axios'
import { Readable } from 'stream'

export class ImageClassifyServices {
    static async get(imageBinary: any): Promise<any> {
        try {
            const host =
                'https://kaprao-image-processing-22ruk3pukq-as.a.run.app/v1/models/default:predict'
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
