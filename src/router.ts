import { Request, Response, Router } from 'express'
const router = Router({ strict: true, caseSensitive: true })
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import { v4 as uuidv4 } from 'uuid'
import OmiseController from './controllers/omise.controller'

router.get('/', hi)
router.post('/', hi)

router.post('/payment/promptpay/create', OmiseController.createPromptPay)
router.post('/payment/scb/create', OmiseController.createSCB)
router.post('/payment/bbl/create', OmiseController.createBBL)
router.post('/payment/ktb/create', OmiseController.createKTB)
router.post('/payment/bay/create', OmiseController.createBAY)
router.get('/payment/ispaid/:chargesId', OmiseController.isPaid)
router.get('/payment/refund/:chargesId', OmiseController.refund) // This is dangerous, don't use on production

router.get('/uuid', (req,res) => res.json(uuidv4()))
router.post('/omise/webhook', OmiseController.webhookHandle)

function hi(req: Request, res: Response) {
    if (JSON.stringify(req.body) === '{}') res.send('No req.body :(')
    else res.send(req.body)
}

export default router
