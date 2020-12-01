import { NextFunction, Request, Response } from 'express'
import { Op } from 'sequelize'
import { all } from 'sequelize/types/lib/operators'
import { Orders } from '../models/order'
import { Restaurants } from '../models/restaurant'
import { MenuServices } from '../services/menu.services'

export class DashboardController {
    static async summary(req: Request, res: Response, next: NextFunction) {
        try {
            const restaurant = await Restaurants.findOne({
                where: {
                    lineUid: req.user.userId,
                },
            })

            const midnightPrev = new Date().setHours(0, 0, 0, 0)
            const midnightNext = new Date().setHours(24, 0, 0, 0)

            const order = await Orders.findAll({
                where: {
                    restaurantId: restaurant.id,
                    status: 'COMPLETE',
                    createdAt: {
                        [Op.gt]: midnightPrev,
                        [Op.lt]: midnightNext,
                    },
                },
            })

            const menu = order.reduce((prev, newOrder) => {
                return [
                    ...prev,
                    ...newOrder.selectedMenu
                ]
            }, [])

            let accProperty = {}
            menu.forEach((order) => {
                let menuId = order.menuId
                if (accProperty[menuId])
                    accProperty[menuId] = {
                        ...accProperty[menuId],
                        unit: accProperty[menuId].unit + order.unit,
                        price: accProperty[menuId].price + order.price,
                    }
                else {
                    accProperty[menuId] = {
                        name: order.name,
                        unit: order.unit,
                        price: order.price,
                    }
                }
            })

            res.json(accProperty)
        } catch (err) {
            next(err)
        }
    }
}
