import { Response, Request, NextFunction } from 'express'
import { RestaurantServices } from '../services'

export class RestaurantController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description, address, postal, phone, imgUrl, lineUid } = req.body
            const response = await RestaurantServices.create(
                name,
                description,
                address,
                postal,
                phone,
                imgUrl,
                lineUid
            )
            return response
        } catch (e) {
            next(e)
        }
    }
}
