import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import * as omise from 'omise'
import axios from 'axios'

const Omise = omise.default({
    publicKey: process.env.OMISE_PUB_KEY || '',
    secretKey: process.env.OMISE_PRIVATE_KEY || '',
    omiseVersion: '2019-05-29',
})
export default class OmiseServices {
    static async createPrompPay(amount: number) {
        try {
            const source = await Omise.sources.create({
                type: 'promptpay',
                amount: amount,
                currency: 'THB',
            })
            const charges = await Omise.charges.create({
                amount: amount,
                currency: 'THB',
                source: source.id,
                description: 'restaurant1',
            })
            return charges
        } catch (error) {
            console.error(error.message)
        }
    }
    static async search() {
        try {
            const payload = await axios.get(
                'https://api.omise.co/search?scope=charge&filters[status]=successful&query[description]=restaurant1',
                {
                    headers: {
                        authorization: `Basic c2tleV90ZXN0XzVsZmhzMnJrZzhoNXd2OGMwczM=`,
                    },
                }
            )
            console.log(payload.data)
            return payload.data
        } catch (error) {
            console.error(error)
        }
    }

    static async webhookHandle(req: any, res: any) {
        const { key } = req.body
        console.log(key)
    }
}
