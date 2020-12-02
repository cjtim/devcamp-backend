import { NextFunction, Request, Response } from 'express'
import { ORDER_STATUS } from '../enum'
import { Orders } from '../models/order'
import { Restaurants } from '../models/restaurant'
import { Transactions } from '../models/transaction'
import { OrderServices } from '../services/order.services'

export class OrderController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { selectedMenu, restaurantId } = req.body
            const menuData = await OrderServices.create(
                selectedMenu,
                req.user.userId,
                restaurantId
            )
            res.json(menuData)
        } catch (e) {
            next(e)
        }
    }
    static async get(req: Request, res: Response, next: NextFunction) {
        try {
            const { orderId } = req.body
            const order = await Orders.findByPk(orderId, {
                include: [Transactions, Restaurants],
            })
            if (!order) res.sendStatus(400)
            res.json(order)
        } catch (e) {
            next(e)
        }
    }
    static async list(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await Orders.findAll({
                include: [Transactions, Restaurants],
                order: [['updatedAt', 'DESC']],
                where: {
                    lineUid: req.user.userId,
                },
            })
            if (response) res.json(response)
            else res.sendStatus(404)
        } catch (e) {
            next(e)
        }
    }
    static async activeOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const restaurantId = req.user.userId
            const response = await OrderServices.getActiveOrder(restaurantId)
            res.json(response)
        } catch (e) {
            next(e)
        }
    }
    static async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { orderId, status, reason } = req.body
            const response = await OrderServices.updateStatus(
                orderId,
                status,
                reason
            )
            res.json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
    static async queue(req: Request, res: Response, next: NextFunction) {
        try {
            const { orderId } = req.body
            const order = await Orders.findByPk(orderId, { raw: true })
            if (!order) return res.sendStatus(400)

            const allOrder = await Orders.findAll({
                where: {
                    status: ORDER_STATUS.COOKING,
                    restaurantId: order.restaurantId,
                },
                raw: true,
            })

            allOrder.reduce((queue, currentOrder) => {
                if (currentOrder.id == orderId) res.json({ queue: queue })
                return queue + 1
            }, 1)
            // if cannot find match cooking order
            if (!res.headersSent)
                res.json({ queue: 0, message: 'order is not cooking' })
        } catch (e) {
            next(e)
        }
    }
}
