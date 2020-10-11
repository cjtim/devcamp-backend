import { NextFunction, Response } from "express";
import LineService from "../services/line.services";
import { RequestWithUser } from "../utils/type";

export default class LiffMiddleware {
    static async liffVerify(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            const accessToken = req.headers.authorization?.split(' ')[1] || ''
            if (LineService.isTokenValid(accessToken)) {
                req.user = LineService.getProfile(accessToken)
            }
            next()
        } catch (e) {
            res.status(403).send('Access Denied')
            console.log(e.message)
        }
    }
}