import { Op } from 'sequelize'
import { LineServices, OrderServices, RestaurantServices } from '.'
import { ORDER_STATUS } from '../enum'
import { Orders } from '../models/order'

export class ConsoleServices {
    static async getActiveOrder(restaurantId: string) {
        try {
            const restaurant: any = await RestaurantServices.getFromLineUid(
                restaurantId
            )
            const response = await Orders.findAll({
                where: {
                    restaurantId: restaurant?.id,
                    [Op.not]: {
                        status: ORDER_STATUS.FAILED,
                    },
                    [Op.not]: {
                        status: ORDER_STATUS.COMPLETE,
                    },
                },
                raw: true,
            })
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
        const order: any = await OrderServices.update(
            orderId,
            'status',
            statusValue
        )
        if (statusValue == ORDER_STATUS.COOKING) {
            LineServices.sendMessage(order.lineUid, 'Your order is cooking')
        } else if (status == ORDER_STATUS.WAIT_FOR_PICKUP) {
            LineServices.sendMessage(
                order.lineUid,
                'Your order is ready to pickup'
            )
        } else if (status == ORDER_STATUS.COMPLETE) {
            LineServices.sendMessage(
                order.lineUid,
                'Thank you, enjoy your meal.'
            )
        } else if (status == ORDER_STATUS.FAILED) {
            LineServices.sendMessage(
                order.lineUid,
                `Your order has been cancel due to ${reason}.`
            )
            // refund money
        }
        return order
    }
}
