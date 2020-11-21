import { Op } from 'sequelize'
import { ORDER_STATUS } from '../enum'
import { Menus } from '../models/menu'
import { Orders } from '../models/order'

export class OrderServices {
    static async create(
        selectedMenu: Array<Object>,
        lineUid: string,
        restaurantId: string
    ) {
        try {
            const menuIdList: Array<Object> = selectedMenu.map(
                (i: any) => i.menuId
            )
            let totalAmount: number = 0
            let response = []
            const data: any = await Menus.findAll({
                where: {
                    id: {
                        [Op.or]: menuIdList, // [{id: 'uuid'}, {id: 'uuid'}]
                    },
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'img'],
                },
                raw: true,
            })
            if (!data) return { status: 'not found menu' }
            let parseDataMenu: {
                name: string
                price: number
                restaurantId: string
            }[] = []
            data.forEach((i: any) => {
                parseDataMenu[i.id] = {
                    name: i.name,
                    price: i.price,
                    restaurantId: i.restaurantId,
                }
            })
            response = selectedMenu.map((i: any) => {
                const menuData = parseDataMenu[i.menuId]
                const price: number = menuData.price * i.unit
                totalAmount += price
                return {
                    ...i,
                    price: menuData.price * i.unit,
                    pricePerUnit: menuData.price,
                }
            })

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
    static async update(orderId: string, key: string, value: any) {
        const order = await Orders.findOne({
            where: {
                id: orderId,
            },
        })
        order?.setDataValue(key, value)
        await order?.save()
        return order?.toJSON()
    }
}
