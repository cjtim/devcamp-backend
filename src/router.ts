import { Router } from 'express'
const router = Router({ strict: true, caseSensitive: true })
import { v4 as uuidv4 } from 'uuid'
import { DashboardController } from './controllers/dashboard.controller'
import { LineController } from './controllers/line.controller'
import { MenuController } from './controllers/menu.controller'
import { OrderController } from './controllers/order.controller'
import { RestaurantController } from './controllers/restaurant.controller'
import { SCBController } from './controllers/scb.controller'
import { TransactionController } from './controllers/transaction.controller'
import { UserController } from './controllers/user.controller'
import LineMiddleware from './middleware/line.middleware'


// User
router.post('/user/update', LineMiddleware.liffVerify, UserController.update)
router.post('/user/get', LineMiddleware.liffVerify, UserController.get)
// Restaurant
router.post('/restaurant/create', RestaurantController.create)
router.post('/restaurant/get', RestaurantController.get)
router.post('/restaurant/list', RestaurantController.list)
router.post('/restaurant/getbylineuid', RestaurantController.getRestaurantByLineUid)
// Menu
router.post('/menu/create', MenuController.create)
router.post('/menu/get', MenuController.get)
router.post('/menu/list', MenuController.list)
router.post('/menu/search', MenuController.search)
router.post('/menu/random', MenuController.random)
// Order
router.post('/order/create', LineMiddleware.liffVerify, OrderController.create)
router.post('/order/get', LineMiddleware.liffVerify, OrderController.get)
router.post('/order/list', LineMiddleware.liffVerify, OrderController.list)
router.post('/order/queue', OrderController.queue)
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
router.post('/dashboard/summary', LineMiddleware.liffVerify, DashboardController.summary)


// Webhook
router.post('/scb/webhook', SCBController.webhookHandle)
router.post('/line/webhook', LineController.webhookHandle)


router.get('/uuid', (req, res) => res.json(uuidv4()))


export default router
