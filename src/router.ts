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
// Restaurant
router.post('/restaurant/create', RestaurantController.create)
router.post('/restaurant/get', RestaurantController.get)
router.post('/restaurant/list', LineMiddleware.liffVerify, RestaurantController.list)
// Menu
router.post('/menu/create', MenuController.create)
router.post('/menu/get', MenuController.get)
router.post('/menu/list', MenuController.list)
// Order
router.post('/order/create', LineMiddleware.liffVerify, OrderController.create)
router.post('/order/get', OrderController.get)
router.post('/order/list', OrderController.list)
// Transaction
router.post(
    '/transaction/create',
    LineMiddleware.liffVerify,
    TransactionController.create
)
router.post('/transaction/get')
router.post('/transaction/list')
router.post('/transaction/ispaid', LineMiddleware.liffVerify ,TransactionController.isPaid)





// Webhook
router.post('/scb/webhook', SCBController.webhookHandle)
router.post('/omise/webhook', OmiseController.webhookHandle)
router.post('/line/webhook', LineMiddleware.webhookVerify, (req, res) =>
res.status(200)
)

router.get('/uuid', (req, res) => res.json(uuidv4()))


export default router
