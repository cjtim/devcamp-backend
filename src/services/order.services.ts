import { Model, Op } from 'sequelize'
import { values } from 'sequelize/types/lib/operators'
import { ORDER_STATUS } from '../enum'
import { Menus } from '../models/menu'
import { Orders } from '../models/order'
import { Restaurants } from '../models/restaurant'
import { Transactions } from '../models/transaction'
import { LineServices } from './line.services'
import { MessageGeneratorServices } from './messageGenerator.services'
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
    static async update(orderId: number, key: any, value: any) {
        const order = await Orders.findOne({
            where: {
                id: orderId,
            },
            include: [Transactions]
        })
        order?.setDataValue(key, value)
        await order?.save()
        return order
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
                include: [Transactions, Restaurants],
            })
            return response
        } catch (e) {
            throw e
        }
    }
    static async updateStatus(
        orderId: number,
        statusValue: ORDER_STATUS,
        reason?: string
    ) {
        const order: any = await this.update(orderId, 'status', statusValue)
        console.log(order.toJSON())
        if (statusValue == ORDER_STATUS.COOKING) {

            const tips = {
                0:'tips : การข้ามอาหารมื้อเช้าอาจนำไปสู่ความหิวแบบไม่มีที่สิ้นสุด!!',
                1:'tips : ผู้ใหญ่ควรดื่มน้ำอย่างน้อย 1.5 - 2 ลิตรต่อวัน หรือมากกว่านั้นถ้าร้อนหรือต้องใช้กำลังมาก',
                2: 'tips : ไขมันส่วนเกินจากร่างกายมาจากการกินของกินมากยิ่งกว่าแคลอรี่ที่ร่างกายต้องการ อาจมาได้จากของกินหลายแหล่ง อย่างเช่น โปรตีน ไขมัน คาร์โบไฮเดรต หรือแอลกอฮอล์',
                3: 'tips : อะโวคาโด อุดมไปด้วยไขมันไม่อิ่มตัวเชิงเดี่ยว ที่ช่วยลดความอยากอาหารลงเยอะมากๆ !!!',
                4: 'tips : พาสต้า & ขนมปัง มีใยอาหาร และ โปรตีน จะทำให้อยู่ท้องไปอีกนานเลยแหละ'
            }
        
            let randomNum = Math.floor(Math.random() * 5 )

           
            

            LineServices.sendMessageRaw(order.lineUid, MessageGeneratorServices.cookingOrder(order.id, tips[randomNum]))


        } else if (statusValue == ORDER_STATUS.WAIT_FOR_PICKUP) {
            let summaryOrderFormart = order.selectedMenu.length + ' จาน , ราคา ' + order.Transactions[0].amount + ' บาท'
            let summaryFoodNameFormart =''
            order.selectedMenu.map(values => {
                return summaryFoodNameFormart += values.name + ' / '
            })
            LineServices.sendMessageRaw(order.lineUid, MessageGeneratorServices.updateOrder(order.id,summaryOrderFormart,summaryFoodNameFormart))
            // LineServices.sendMessage(
            //     order.lineUid,
            //     'Your order is ready to pickup'
            // )
        } else if (statusValue == ORDER_STATUS.COMPLETE) {
            LineServices.sendMessageRaw(order.lineUid, MessageGeneratorServices.completeOrder(order.id, 'โอกาสหน้าเชิญ ใช้บริการใหม่'))

        } else if (statusValue == ORDER_STATUS.FAILED) {

            LineServices.sendMessageRaw(order.lineUid, MessageGeneratorServices.cancelOrder(order.id, `Your order has been cancel due to ${reason}.`))


            // refund money
        }
        return order
    }
}
