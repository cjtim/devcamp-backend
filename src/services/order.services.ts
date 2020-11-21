import { Op } from 'sequelize'
import { ORDER_STATUS } from '../enum'
import { Menus } from '../models/menu'
import { Orders } from '../models/order'
import { Transactions } from '../models/transaction'
import { LineServices } from './line.services'
import { RestaurantServices } from './restaurant.services'

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
    static async getActiveOrder(lineUid: string) {
        try {
            const restaurant: any = await RestaurantServices.getFromLineUid(
                lineUid
            )
            if (!restaurant) throw new Error('This user is not restaurant')
            const response = await Orders.findAll({
                where: {
                    restaurantId: restaurant?.id,
                    [Op.not]: [
                        {
                            status: [
                                ORDER_STATUS.COMPLETE,
                                ORDER_STATUS.WAIT_FOR_PAYMENT,
                                ORDER_STATUS.FAILED,
                            ],
                        },
                    ],
                },
                raw: true,
                include: Transactions,
            })
            console.log(response)
            return response
        } catch (e) {
            throw e
        }
    }
    static async updateStatus(
        orderId: string,
        statusValue: ORDER_STATUS,
        reason?: string
    ) {
        const order: any = await this.update(orderId, 'status', statusValue)
        if (statusValue == ORDER_STATUS.COOKING) {
            LineServices.sendMessage(order.lineUid, 'Your order is cooking')
        } else if (statusValue == ORDER_STATUS.WAIT_FOR_PICKUP) {
            LineServices.sendMessage(
                order.lineUid,
                'Your order is ready to pickup'
            )
        } else if (statusValue == ORDER_STATUS.COMPLETE) {
            LineServices.sendMessage(
                order.lineUid,
                'Thank you, enjoy your meal.'
            )
        } else if (statusValue == ORDER_STATUS.FAILED) {
            LineServices.sendMessage(
                order.lineUid,
                `Your order has been cancel due to ${reason}.`
            )
            // refund money
        }
        return order
    }
}
