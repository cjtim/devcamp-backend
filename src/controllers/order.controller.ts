import { NextFunction, Request, Response } from 'express'
import { ORDER_STATUS } from '../enum'
import { Orders } from '../models/order'
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
            const response = await Orders.findByPk(orderId, {
                include: Transactions
            })
            if (response) res.json(response)
            else res.sendStatus(404)
        } catch (e) {
            next(e)
        }
    }
    static async list(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await Orders.findAll({
                include: {
                    model: Transactions,
                },
                order: [['updatedAt', 'DESC']],
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
}
