import { Op } from 'sequelize'
import { ORDER_STATUS } from '../enum'
import { Menus } from '../models/menu'
import { Orders } from '../models/order'

export class OrderServices {
    static async create(
        menuIdList: Array<Object>,
        unitList: Array<number>,
        lineUid: string,
        restaurantId: string
    ) {
        try {
            let totalAmount: number = 0
            const response = []
            const data = await Menus.findAll({
                where: {
                    id: {
                        [Op.or]: menuIdList, // [{id: 'uuid'}, {id: 'uuid'}]
                    },
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'img'],
                },
            })
            if (!data) return { status: 'not found menu' }
            for (let i = 0; i < data.length; i++) {
                const item = data[i].get()
                response.push({ ...item, payAmount: item.price * unitList[i] })
                totalAmount = totalAmount + item.price * unitList[i]
            }
            const orderPayload = await Orders.create({
                status: ORDER_STATUS.WAIT_FOR_PAYMENT,
                lineUid: lineUid,
                selectedMenu: response,
                restaurantId: restaurantId,
            })
            return { ...orderPayload.get(), totalAmount: totalAmount }
        } catch (e) {
            throw new Error('cannot create order ' + e.message)
        }
    }
}
