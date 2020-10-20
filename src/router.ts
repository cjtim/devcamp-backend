import { Request, Response, Router } from 'express'
const router = Router({ strict: true, caseSensitive: true })
import { v4 as uuidv4 } from 'uuid'
import OmiseController from './controllers/omise.controller'
import * as line from '@line/bot-sdk'
import CONST from './const'
import LineMiddleware from './middleware/line.middleware'
import PaymentController from './controllers/payment.controller'
import { SCBServices } from './services/scb.services'

const config = {
    channelAccessToken: CONST.LINE_CHANNEL_TOKEN,
    channelSecret: CONST.LINE_CHANNEL_SECRET,
}
router.get('/', hi)
router.post('/', hi)

router.post(
    '/payment/promptpay/create',
    LineMiddleware.liffVerify,
    PaymentController.createPromptPay
)
// router.get('/payment/ispaid/:chargesId', PaymentController.isPaid)
// router.get('/payment/refund/:chargesId', PaymentController.refund) // This is dangerous, don't use on production
router.post(
    '/payment/charges/create',
    LineMiddleware.liffVerify,
    PaymentController.createWithOmiseForm
)
router.post('/payment/scb', async(req, res) => {
    const {amount} = req.body
    res.status(200).send(await SCBServices.createLink(amount))
})
router.get('/uuid', (req, res) => res.json(uuidv4()))
router.post('/omise/webhook', OmiseController.webhookHandle)
router.post('/line/webhook', line.middleware(config), (req, res) =>
    res.status(200)
)

function hi(req: Request, res: Response) {
    if (JSON.stringify(req.body) === '{}') res.send('No req.body :(')
    else res.status(200).send(req.body)
}

export default router
