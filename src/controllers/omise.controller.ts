import { Request, Response } from 'express'
import LineService from '../services/line.services'
import OmiseServices from '../services/omise.services'
import { RequestWithUser } from '../utils/type'

export default class OmiseController {
    static async webhookHandle(req: Request, res: Response) {
        const { key } = req.body
        console.log(key)
        res.status(200)
    }
    static async createPromptPay(req: Request, res: Response) {
        const { amount, orderId } = req.body
        res.json(await OmiseServices.createPromptPay(amount, orderId))
    }
    static async createSCB(req: Request, res: Response) {
        const { amount, orderId } = req.body
        res.json(await OmiseServices.createBank(amount, 'scb', orderId))
    }
    static async createBBL(req: Request, res: Response) {
        const { amount, orderId } = req.body
        res.json(await OmiseServices.createBank(amount, 'bbl', orderId))
    }
    static async createKTB(req: Request, res: Response) {
        const { amount, orderId } = req.body
        res.json(await OmiseServices.createBank(amount, 'ktb', orderId))
    }
    static async createBAY(req: Request, res: Response) {
        const { amount, orderId } = req.body
        res.json(await OmiseServices.createBank(amount, 'bay', orderId))
    }
    static async isPaid(req: Request, res: Response) {
        const { chargesId } = req.params
        res.json(await OmiseServices.isPaid(chargesId))
    }
    static async getStatus(req: Request, res: Response) {}
    static async refund(req: Request, res: Response) {
        const { chargesId } = req.params
        res.json(await OmiseServices.refund(chargesId))
    }
    static async createCharges(req: any, res: Response) {
        const { source } = req.body
        console.log('userId '+ req.user.lineUserId )
        const payment_url = await OmiseServices.createCharge(source, '001')
        res.json(payment_url)
        await LineService.sendMessage(req.user.lineUserId, 'Transaction pending..' + payment_url)
    }
}
