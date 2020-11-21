import { Router } from 'express'
const router = Router({ strict: true, caseSensitive: true })
import { v4 as uuidv4 } from 'uuid'
import { LineController } from './controllers/line.controller'
import { MenuController } from './controllers/menu.controller'
import { OrderController } from './controllers/order.controller'
import { RestaurantController } from './controllers/restaurant.controller'
import { SCBController } from './controllers/scb.controller'
import { TransactionController } from './controllers/transaction.controller'
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
router.post('/transaction/list', LineMiddleware.liffVerify, TransactionController.list)
router.post('/transaction/ispaid', LineMiddleware.liffVerify ,TransactionController.isPaid)

router.post('/dashboard/activeorder', LineMiddleware.liffVerify, OrderController.activeOrder)
router.post('/dashboard/updatestatus', LineMiddleware.liffVerify, OrderController.updateStatus)



// Webhook
router.post('/scb/webhook', SCBController.webhookHandle)
router.post('/line/webhook', LineController.webhookHandle)


router.get('/uuid', (req, res) => res.json(uuidv4()))


export default router
