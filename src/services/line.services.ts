import axios from 'axios'
import CONST from './../const'
export default class LineService {
    static async isTokenValid(accessToken: string) {
        try {
            const response = await axios.get(
                CONST.LINE_VERIFY_LIFF_TOKEN_API + accessToken
            )
            if (response.status === 200) {
                return true
            }
        } catch (error) {
            console.error(error.message)
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
}
