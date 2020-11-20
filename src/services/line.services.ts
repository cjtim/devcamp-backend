import axios from 'axios'
import * as line from '@line/bot-sdk'
import CONST from './../const'
import { Message } from '@line/bot-sdk/dist/types'

const config = {
    channelAccessToken: CONST.LINE_CHANNEL_TOKEN,
    channelSecret: CONST.LINE_CHANNEL_SECRET,
}

const client = new line.Client(config)
export class LineServices {
    static async isTokenValid(accessToken: string) {
        try {
            const response = await axios.get(
                CONST.LINE_VERIFY_LIFF_TOKEN_API + accessToken
            )
            if (response.status === 200) {
                return true
            }
        } catch (error) {
            throw new Error('error with verify line token ' + error.message)
        }
        return false
    }
    static async getProfile(accessToken: string) {
        try {
            const headers = {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
            const response = await axios.get(
                CONST.LINE_GET_PROFILE_API,
                headers
            )
            const { data } = response
            return {
                lineUserId: data.userId,
                lineDisplayName: data.displayName,
                lineImgUrl: data.pictureUrl,
            }
        } catch (e) {
            throw new Error('Cannot get line profile' + e.message)
        }
    }
    static async sendMessage(lineUid: string, message: string) {
        try {
            return await client.pushMessage(lineUid, {
                type: 'text',
                text: message,
            })
        } catch (e) {
            console.error('Cannot send message ' + e.message)
        }
    }
    static async sendMessageRaw(lineUid: string, json: Message | Message[]) {
        try {
            return await client.pushMessage(lineUid, json)
        } catch (e) {
            console.error('Cannot send message ' + e.message)
        }
    }
    static async getBinaryContent(messageId: string): Promise<Buffer> {
        try {
            const stream = await client.getMessageContent(messageId)
            return new Promise((res, rej) => {
                let chunks: Array<Buffer> = []
                stream.on('data', (chunk) => {
                    chunks.push(chunk)
                })
                stream.on('end', () => {
                    res(Buffer.concat(chunks))
                })
                stream.on('error', (err) => {
                    console.log('cannot stream on')
                    throw err
                })
            })
        } catch (e) {
            throw e
        }
    }
    static async reply(replyToken: string, json: Message | Message[]) {
        try {
            return client.replyMessage(replyToken, json)
        } catch (e) {
            throw e
        }
    }
}
