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
    static async put(path: string, data: object) {
        const payload = await database.ref(path).update(data)
        return payload
    }
    static async get(path: string): Promise<object> {
        const payload = await database.ref(path).once('value')
        return payload.exportVal()
    }
    static async delete(path: string): Promise<boolean> {
        try {
            await database.ref(path).remove()
            return true
        } catch (error) {
            return false
        }
    }
}
