import { NextFunction, Request, Response } from 'express'
import { ORDER_STATUS } from '../enum'
import { RestaurantServices } from '../services'
import { ConsoleServices } from '../services/console.services'

export class ConsoleController {
    static async activeOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const restaurantId = req.user.userId
            const response = await ConsoleServices.getActiveOrder(restaurantId)
            res.json(response)
        } catch (e) {
            next(e)
        }
    }
    static async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { orderId, status, reason } = req.body
            const response = await ConsoleServices.updateStatus(
                orderId,
                ORDER_STATUS[status],
                reason
            )
            res.json(response)
        } catch (e) {
            next(e)
        }
    }
    static async isRestaurant(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            if (await RestaurantServices.getFromLineUid(req.user.userId)){
                res.sendStatus(200)
            }
        } catch (e) {
            next(e)
        }
    }
}
