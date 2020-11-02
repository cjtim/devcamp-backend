import { NextFunction, Request, Response } from 'express'
import { PAYMENT_METHOD } from '../enum'
import { TransactionServices } from '../services'

export class TransactionController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { method, sourceId, payAmount, orderId } = req.body
            let response: any
            response = await TransactionServices.create(
                method === 'OMISE' ? PAYMENT_METHOD.OMISE : PAYMENT_METHOD.SCB_EASY,
                payAmount,
                orderId,
                req.user.userId,
                sourceId
            )
        } catch (e) {
            next(e)
        }
    }
    static async get(req: Request, res: Response, next: NextFunction) {
        try {
            const { transactionId } = req.body
            res.json(await TransactionServices.getTransaction(transactionId))
        } catch (e) {
            next(e)
        }
    }
}
