import { NextFunction, Request, Response } from 'express'
import { Transactions } from '../models/transaction'
import { LineServices, TransactionServices } from '../services'

export class SCBController {
    static async webhookHandle(req: Request, res: Response, next: NextFunction) {
        try {
            // save to database
            // update database
            // send message to user
            const { transactionId } = req.body
            const response = await TransactionServices.completeVerified(transactionId)
            res.json(response)
        } catch (e) {
            next(e)
        }
    }
}
