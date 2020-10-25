import { NextFunction, Request, Response } from 'express'
import { TransactionServices } from '../services'

export class OmiseController {
    static async webhookHandle(req: Request, res: Response, next: NextFunction) {
        const { key } = req.body
        console.log(key)
        if (key === 'charge.complete') {
            const chargePayload = req.body
            TransactionServices.omiseChargeComplete(chargePayload.id)
        }
        res.status(200)
    }
}
