import { Request, Response } from 'express'
import { Transactions } from '../models/transaction'
import { LineServices } from '../services'

export class SCBController {
    static async webhookHandle(req: Request, res: Response) {
        try {
            // save to database
            // update database
            // send message to user
            const { transactionId } = req.body
            const database = await Transactions.findByPk(transactionId)
            await LineServices.sendMessage(
                database?.getDataValue('lineUid'),
                'Transaction Complete\n ref: ' + transactionId
            )
            res.sendStatus(200)
        } catch (e) {
            throw new Error('error with scb webhook')
        }
    }
}
