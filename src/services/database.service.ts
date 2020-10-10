import * as firebase from 'firebase/app'
import 'firebase/database'
const firebaseServiceAcc = require('../../firebaseServiceAcc.json')
firebase.initializeApp(firebaseServiceAcc)
const database = firebase.database()
export default class DatabaseServices {
    static async set(path: string, data: object): Promise<any>{
        try {
            const payload = database.ref(path)
            return await payload.set(data)
        } catch (error) {
            console.log(error.message)
        }
    }
    static async put(path: string, data: object){
        const payload = database.ref(path)
        return await payload.update(data)
    }
    static async get(path: string): Promise<object>{
        const payload = await database.ref(path).once('value')
        return payload
    }
    static async delete(path: string): Promise<boolean> {
        try {
            await database.ref(path).remove()
            return true
        } catch (error) {
            return false;
        }
    }
}