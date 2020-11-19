import { NextFunction, Request, Response } from 'express'
import { json } from 'sequelize/types'
import { LineServices } from '../services'
import { ImageClassifyServices } from '../services/imageClassify.services'

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
                const binaryImage = await LineServices.getContent(id)
                const result = await ImageClassifyServices.get(binaryImage)
                LineServices.reply(replyToken, {
                    type: 'text',
                    text: JSON.stringify(result),
                })
            }
            res.sendStatus(200)
        } catch (e) {
            next(e)
        }
    }
}
