import * as admin from 'firebase-admin'
import 'firebase/database'
import CONST from '../const'
admin.initializeApp({
    credential: admin.credential.cert(CONST.FIREBASE_ACC),
    databaseURL: CONST.FIREBASE_DB,
})
const database = admin.database()
export default class DatabaseServices {
    // dangerous to use, overide exist data
    // static async set(path: string, data: object): Promise<any> {
    //     try {
    //         const payload = database.ref(path)
    //         return await payload.set(data)
    //     } catch (error) {
    //         console.log(error.message)
    //     }
    // }
    static async update(path: string, data: object): Promise<any> {
        await database.ref(path).update(data)
        const payload = await this.get(path)
        return payload
    }
    static async get(path: string): Promise<any> {
        const payload: admin.database.DataSnapshot = await database
            .ref(path)
            .once('value')
        return payload.exportVal()
    }
    static async delete(path: string): Promise<boolean | Error> {
        try {
            await database.ref(path).remove()
            return true
        } catch (error) {
            throw new Error('cannot delete database')
        }
    }

    static async saveChargePayload(chargePayload: any, userId?: string) {
        try {
            const data = {
                ...chargePayload,
                userId: userId
            }
            const databasePath = `/chargesId/${chargePayload!.id}`
            const databasePayload: any = await this.update(
                databasePath,
                data
            )
            return databasePayload
        } catch (e) {
            throw new Error('cannot save charge to database ' + e.message)
        }
    }
}
