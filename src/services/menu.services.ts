import { Menus } from "../models/menu";

export class MenuServices {
    static async create(name: string, price: number, img: string, restaurantId: string){
        try{
            return await Menus.create({
                name: name,
                price: price,
                img: img,
                restaurantId: restaurantId
            })
        } catch (e) {
            throw new Error('cannot create Menu ' + e.message)
        }
    }
}