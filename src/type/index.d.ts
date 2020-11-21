import { Request } from 'express'

interface IUser {
    userId: string
}
declare global {
    namespace Express {
        interface Request {
            user: IUser
        }
    }
}

export interface ISelectedMenu {
    img: string
    name: string
    note: string
    unit: number
    price: number
    menuId: string
    pricePerUnit: number
    restaurantId: string
}