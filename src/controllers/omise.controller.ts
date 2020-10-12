import { Request, Response } from 'express'
import LineService from '../services/line.services'
import OmiseServices from '../services/omise.services'
import PaymentController from './payment.controller'

export default class OmiseController {
    static async webhookHandle(req: Request, res: Response) {
        const { key } = req.body
        console.log(key)
        if (key === 'charge.complete') {
            PaymentController.webhookChargeComplete(req, res)
        }
        res.status(200)
    }
}
