import { NextFunction, Request, Response } from 'express'
import { PAYMENT_METHOD } from '../enum'
import { Transactions } from '../models/transaction'
import { SCBServices, TransactionServices } from '../services'

export class TransactionController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { payAmount, orderId } = req.body
            const response = await SCBServices.createLink(payAmount)
            await Transactions.create({
                id: response!.transactionId,
                method: PAYMENT_METHOD.SCB,
                amount: payAmount,
                lineUid: req.user.userId,
                orderId: orderId,
            })
            res.json({ deeplinkUrl: response!.deeplinkUrl })
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
    static async list(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(await Transactions.findAll())
        } catch (e) {
            next(e)
        }
    }
    static async isPaid(req: Request, res: Response, next: NextFunction) {
        try {
            const { transactionId } = req.body
            const isPaid = await TransactionServices.isPaid(transactionId)
            res.json({ paid: isPaid })
        } catch (e) {
            next(e)
        }
    }
}
