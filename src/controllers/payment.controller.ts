import { Response } from 'express'
import PaymentServices from '../services/payment.services'

export default class PaymentController {
    static async createWithOmiseForm(req: any, res: Response) {
        try {
            const { source, amount }: { source: string, amount: number} = req.body
            const userId = req.user.lineUserId
            let chargePayload: any

            if (source.startsWith('tokn')) {
                chargePayload = await PaymentServices.chargeCreditCardFromToken(userId, source, amount)
                PaymentServices.userCompleteOrder(chargePayload.id)
            } else {
                chargePayload = await PaymentServices.createChargeFromSource(userId, source)
            }

            const paymentUrl = chargePayload.authorize_uri
            res.json(paymentUrl)
        } catch (e) {
            res.status(400).send(e.message)
        }
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
            res.status(400).send(e.message)
        }
    }
}
