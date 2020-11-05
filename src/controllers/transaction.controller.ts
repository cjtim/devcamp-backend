import { NextFunction, Request, Response } from 'express'
import { PAYMENT_METHOD } from '../enum'
import { Transactions } from '../models/transaction'
import { SCBServices, TransactionServices } from '../services'

export class TransactionController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { payAmount, orderId } = req.body
            let response: any
            response = await SCBServices.createLink(payAmount)
            await Transactions.create({
                id: response.data.transactionId,
                method: PAYMENT_METHOD.SCB_EASY,
                amount: payAmount,
                lineUid: req.user.userId,
                orderId: orderId,
            })
            res.json({ deeplinkUrl: response.data.deeplinkUrl })
        } catch (e) {
            console.log(e)
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
