import { Request, Response } from 'express'
import OmiseServices from '../services/omise.services'

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
    static async createCharges(req: Request, res: Response) {
        const { source } = req.body
        res.json(await OmiseServices.createCharge(source, '001'))
    }
}
