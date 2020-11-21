import { NextFunction, Request, Response } from 'express'
import { LineServices } from '../services/line.services'

export default class LineMiddleware {
    static async liffVerify(req: Request, res: Response, next: NextFunction) {
        try {
            const accessToken = req.headers.authorization?.split(' ')[1] || ''
            if (await LineServices.isTokenValid(accessToken)) {
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
    // static webhookVerify(req: any, res: Response, next: NextFunction) {
    //     try {
    //         line.middleware(config)(req, res, next)
    //     } catch (e) {
    //         next(e)
    //     }
    // }
}
