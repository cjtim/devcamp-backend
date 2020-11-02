import { Op } from 'sequelize'
import { Menus } from '../models/menu'
import { Orders } from '../models/order'

export class OrderServices {
    static async create(menuIdList: Array<Object>, unitList: Array<number>, lineUid: string, restaurantId: string) {
        try {
            const response = []
            const data = await Menus.findAll({
                where: {
                    id: {
                        [Op.or]: menuIdList, // [{id: 'uuid'}, {id: 'uuid'}]
                    },
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
            })
            if (!data) return {status: "not found menu"}
            for (let i = 0; i < data.length; i++) {
                const item = data[i].get()
                response.push({ ...item, payAmount: item.price * unitList[i] })
            }
            const orderPayload = await Orders.create({
                lineUid: lineUid,
                selectedMenu: response,
                restaurantId: restaurantId
            })
            return orderPayload
        } catch (e) {
            throw new Error('cannot create order ' + e.message)
        }
    }
}
