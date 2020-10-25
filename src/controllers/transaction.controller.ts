import { NextFunction, Request, Response } from 'express'
import { PAYMENT_METHOD } from '../enum'
import { TransactionServices } from '../services'

export class TransactionController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { method, sourceId, payAmount, orderId } = req.body
            if (method === "SCB_EASY"){

            }
            else if (method === "OMISE"){
                
            }
            const response = await TransactionServices.create(PAYMENT_METHOD.SCB_EASY, 1233, orderId, req.user.userId)
        } catch (e) {
            next(e)
        }
    }
    static async get(req: Request, res: Response, next: NextFunction) {
        try{
            const {transactionId} = req.body
            res.json(await TransactionServices.getTransaction(transactionId))
        } catch (e){
            next(e)
        }
    }
}
