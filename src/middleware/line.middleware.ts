import { NextFunction, Request, Response } from 'express'
import { LineServices } from '../services'
import * as line from '@line/bot-sdk'
import CONST from './../const'
const config = {
    channelAccessToken: CONST.LINE_CHANNEL_TOKEN,
    channelSecret: CONST.LINE_CHANNEL_SECRET,
}
export default class LineMiddleware {
    static async liffVerify(req: Request, res: Response, next: NextFunction) {
        try {
            const accessToken = req.headers.authorization?.split(' ')[1] || ''
            if (LineServices.isTokenValid(accessToken)) {
                const { lineUserId } = await LineServices.getProfile(
                    accessToken
                )
                req.user = { userId: lineUserId }
                next()
            }
        } catch (e) {
            res.status(403).send('Access Denied')
        }
    }
    static webhookVerify(req: any, res: Response, next: NextFunction) {
        try {
            line.middleware(config)(req, res, next)
        } catch (e) {
            next(e)
        }
    }
}
