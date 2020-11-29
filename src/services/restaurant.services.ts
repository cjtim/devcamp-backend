import { Restaurants } from '../models/restaurant'

export class RestaurantServices {
    static async create(
        name: string,
        description: string,
        address: string,
        phone: string,
        imgUrl: Array<String>,
        lineUid: string
    ) {
        return await Restaurants.create({
            name: name,
            description: description,
            address: address,
            phone: phone,
            imgUrl: imgUrl,
            lineUid: lineUid,
        })
    }
    static async getFromLineUid(lineUid: string) {
        const restaurant = await Restaurants.findOne({
            where: {
                lineUid: lineUid
            }
        })
        return restaurant?.toJSON()
    }
}
