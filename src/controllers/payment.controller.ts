import { Response } from 'express'
import { Charges, Sources } from 'omise'
import OmiseServices from '../services/omise.services'
import PaymentServices from '../services/payment.services'

export default class PaymentController {
    static async createPayment(req: any, res: Response) {
        const { source } = req.body
        const userId = req.user.lineUserId
        const chargePayload = await PaymentServices.createCharge(userId, source)
        const paymentUrl = chargePayload.authorize_uri
        res.json(paymentUrl)
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
        try {
            const { amount } = req.body
            const userId = req.user.lineUserId
            const chargePayload = await PaymentServices.createPromptPay(userId, amount)
            const paymentUrl: string = chargePayload.source.scannable_code.image.download_uri
            res.json(paymentUrl)

        } catch (e) {
            throw new Error('cannot create promptpay ' + e.message)
        }
    }
}
