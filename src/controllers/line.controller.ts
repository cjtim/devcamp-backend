import { NextFunction, Request, Response } from 'express'
import { ImageClassifyServices } from '../services/imageClassify.services'
import { LineServices } from '../services/line.services'
import { MessageGeneratorServices } from '../services/messageGenerator.services'

export class LineController {
    static async webhookHandle(
        req: Request,
        res: Response,
        next: NextFunction
        ) {
            try {
                const { type, id } = req.body.events[0].message
                const { replyToken } = req.body.events[0]
                if (type == 'image') {
                    const binaryImage: Buffer = await LineServices.getBinaryContent(id)
                    const result = await ImageClassifyServices.getPredict(binaryImage)
                    LineServices.reply(
                        replyToken,
                        MessageGeneratorServices.predictResult(result)
                        )
                res.sendStatus(200)
            }
        } catch (e) {
            res.sendStatus(200)
        }
    }
}
