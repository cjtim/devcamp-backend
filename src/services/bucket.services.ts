import { Storage, UploadOptions } from '@google-cloud/storage'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import CONST from './../const'

const storage = new Storage({credentials: CONST.FIREBASE_ACC})
const bucket = storage.bucket(CONST.BUCKET_NAME)
export default class BucketServices {
    static async add(
        parentPath: string,
        localFileLocation: string,
        filename: string = path.basename(localFileLocation)
        ) {
        /*
        parentPath must not start with /
        but must end with /
        example: parentPath = "image/" this is image folder from root
                 filename = "tim.jpg"
        */
       try {
           const uuid = uuidv4()
           const option: UploadOptions = {
               destination: parentPath + filename,
               gzip: true,
               metadata: {
                   metadata: {
                       firebaseStorageDownloadTokens: uuid,
                   },
               },
           }
           const uploadFile = await bucket.upload(localFileLocation, option)
           return "https://firebasestorage.googleapis.com/v0/b/" + 
           bucket.name + "/o/" + encodeURIComponent(uploadFile[0].name) + "?alt=media&token=" + uuid
       } catch (error) {
           console.error(error.message)
       }
    }
    static async remove() {}
    static async getUrl() {}
}
