import * as firebase from 'firebase/app'
import 'firebase/database'
import CONST from '../const'
firebase.initializeApp({
    credential: CONST.FIREBASE_ACC,
    databaseURL: CONST.FIREBASE_DB,
})
const database = firebase.database()
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
        const payload = database.ref(path)
        return await payload.update(data)
    }
    static async get(path: string): Promise<object> {
        const payload = await database.ref(path).once('value')
        return payload
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
