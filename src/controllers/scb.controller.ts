import { NextFunction, Request, Response } from 'express'
import { SCBServices } from '../services/scb.services'
import { TransactionServices } from '../services/transaction.services'

export class SCBController {
    static async webhookHandle(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { transactionId, bypass } = req.body
            if (bypass) {
                await TransactionServices.completeVerified(transactionId)
            }
            if (await SCBServices.isPaid(transactionId)) {
                await TransactionServices.completeVerified(transactionId)
            }
            res.sendStatus(200)
        } catch (e) {
            next(e)
        }
    }

}
