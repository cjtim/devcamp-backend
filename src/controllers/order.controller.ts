import { NextFunction, Request, Response } from 'express'
import { Orders } from '../models/order'
import { OrderServices } from '../services'

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
        try{
            const {orderId} = req.body
            const response = await Orders.findByPk(orderId)
            if (response) res.json(response)
            else res.sendStatus(404)
        } catch (e) {
            next(e)
        }
    }
    static async list(req: Request, res: Response, next: NextFunction) {
        try{
            const response = await Orders.findAll()
            if (response) res.json(response)
            else res.sendStatus(404)
        } catch (e) {
            next(e)
        }
    }
}
