import * as line from '@line/bot-sdk'
import { Request, Response, Router } from 'express'
import { SCBServices } from './services/scb.services'
const router = Router({ strict: true, caseSensitive: true })
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import { v4 as uuidv4 } from 'uuid'
import OmiseServices from './services/omise.services'

// const config: any = {
//     channelAccessToken: process.env.LINE_ACESS_TOKEN,
//     channelSecret: process.env.LINE_SECRET,
// }
// const client = new line.Client(config)

router.get('/', hi)
router.post('/', hi)
router.get('/promptpay/create', async(req, res) => {
    res.json(await OmiseServices.createPrompPay(2000))
})
router.get('/token', async(req, res) => {
    res.send(await SCBServices.getToken(uuidv4()))
})
router.get('/getLink', async (req, res) => {
    res.json(await SCBServices.createLink(10))
})
// router.get('/pay/success/:id', async (req, res) => {
//     try {
//         const transactionId = req.params.id
//         console.log(transactionId)
//         const isPaid = await SCBServices.isPaid(transactionId)
//         if (isPaid) {
//             // const lineUid: string = process.env.LINE_UID || ''
//             // client.pushMessage(lineUid, {
//             //     type: 'text',
//             //     text: 'Transaction Complete!',
//             // })
//             res.status(200)
//         }
//         res.send('not paid')
//         console.log()
//     } catch (error) {
//         console.log(error.message)
//     }
// })
router.get('/uuid', (req,res) => {
    res.json(uuidv4())
})


router.post('/omise/webhook', OmiseServices.webhookHandle)

function hi(req: Request, res: Response) {
    if (JSON.stringify(req.body) === '{}') res.send('No req.body :(')
    res.send(req.body)
}

export default router
