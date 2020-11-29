import { Response, Request, NextFunction } from 'express'
import { Restaurants } from '../models/restaurant'
import { RestaurantServices } from '../services/restaurant.services'

export class RestaurantController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                name,
                description,
                address,
                phone,
                imgUrl,
                lineUid,
            } = req.body
            const response = await RestaurantServices.create(
                name,
                description,
                address,
                phone,
                imgUrl,
                lineUid
            )
            res.status(200).json(response)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
    static async get(req: Request, res: Response, next: NextFunction) {
        try {
            const { restaurantId } = req.body
            const response = await Restaurants.findByPk(restaurantId)
            if (response) res.json(response)
            else res.sendStatus(400)
        } catch (e) {
            next(e)
        }
    }
    static async list(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await Restaurants.findAll()
            if (response) res.json(response)
            else res.sendStatus(404)
        } catch (e) {
            next(e)
        }
    }
    static async getRestaurantByLineUid(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { lineUid } = req.body
            const respose = await Restaurants.findOne({
                where: {
                    lineUid: lineUid
                }
            })
            res.json(respose.toJSON())
        } catch (e) {}
    }
}
