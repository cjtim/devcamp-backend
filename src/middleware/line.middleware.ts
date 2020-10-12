import { NextFunction, Response } from 'express'
import LineService from '../services/line.services'

export default class LineMiddleware {
    static async liffVerify(req: any, res: Response, next: NextFunction) {
        try {
            const accessToken = req.headers.authorization?.split(' ')[1] || ''
            if (LineService.isTokenValid(accessToken)) {
                req.user = await LineService.getProfile(accessToken)
                console.log(req.user)
                next()
            }
        } catch (e) {
            res.status(403).send('Access Denied')
            console.log(e.message)
        }
    }
}
