import { Router } from 'express'
const router = Router({ strict: true, caseSensitive: true })
import { v4 as uuidv4 } from 'uuid'
import {
    OmiseController,
    MenuController,
    OrderController,
    RestaurantController,
    SCBController,
    TransactionController,
} from './controllers'
import LineMiddleware from './middleware/line.middleware'

router.get('/', (req, res) => res.send('Backend working ♥'))

router.post('/restaurant/create', RestaurantController.create)
router.post('/menu/create', MenuController.create)
router.post('/order/create', OrderController.create)

router.post(
    '/transaction/create',
    LineMiddleware.liffVerify,
    TransactionController.create
)

router.get('/uuid', (req, res) => res.json(uuidv4()))

// Webhook
router.post('/scb/webhook', SCBController.webhookHandle)
router.post('/omise/webhook', OmiseController.webhookHandle)
router.post('/line/webhook', LineMiddleware.webhookVerify, (req, res) =>
    res.status(200)
)

export default router
