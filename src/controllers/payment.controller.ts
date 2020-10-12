import { Response } from 'express'
import LineService from '../services/line.services'
import OmiseServices from '../services/omise.services'
import PaymentServices from '../services/payment.services'

export default class PaymentController {
    static async createPayment(req: any, res: Response) {
        const { source } = req.body
        const userId = req.user.lineUserId
        const chargePayload = await PaymentServices.createOrder(userId, source)
        res.json(chargePayload.payment_url)
    }
    static async webhookChargeComplete(req: any, res: Response) {
        try {
            const chargePayload = req.body
            PaymentServices.userCompleteOrder(chargePayload.data.id)
            res.status(200)
        } catch (e) {
            throw new Error('error webhookChargeComplete ' + e.message)
        }
    }
    static async createPromptPay(req: any, res: Response) {
        const { amount, orderId } = req.body
        res.json(await OmiseServices.createPromptPay(amount, orderId))
    }
}
