import { NextFunction, Request, Response } from 'express'
import { validate as uuidValidate } from 'uuid'
import { MenuServices } from '../services'

export class MenuController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, price, img, restaurantId } = req.body
            if (uuidValidate(restaurantId)) {
                const response = await MenuServices.create(name, price, img, restaurantId)
                res.json(response)
            }
            throw new Error('restaurant is not uuid')
        } catch (e) {
            next(e)
        }
    }
}
