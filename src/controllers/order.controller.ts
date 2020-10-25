import { NextFunction, Request, Response } from 'express'
import { OrderServices } from '../services'

export class OrderController {
    static async create(req: Request, res: Response, next: NextFunction) {
        //bug duplicate menuId, result to incorrect payAmount
        try {
            const { selectMenu, restaurantId } = req.body
            const menuIdList: Array<Object> = selectMenu.map((i: any) => {
                return i.menuId
            })
            const unitList: Array<number> = selectMenu.map((i: any) => i.unit)
            const menuData = await OrderServices.create(
                menuIdList,
                unitList,
                req.user.userId,
                restaurantId
            )
            res.json(menuData)
        } catch (e) {
            next(e)
        }
    }
}
