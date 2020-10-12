import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
const CONSTANT = {
    OMISE_API_URL: 'https://api.omise.co',
    OMISE_PUB_KEY: process.env.OMISE_PUB_KEY || '',
    OMISE_PRI_KEY: process.env.OMISE_PRIVATE_KEY || '',
    PAYMENT_RETURN_URL: 'https://cjtim.com/pay/success',
    BUCKET_NAME: process.env.BUCKET_NAME || '',
    FIREBASE_ACC: require('./../firebaseServiceAcc.json'),
    SCB_PUB_KEY: process.env.SCB_API_KEY || '',
    SCB_PRI_KEY: process.env.SCB_API_SECRET_KEY || '',
    SCB_GET_TOKEN_API:
        'https://api-sandbox.partners.scb/partners/sandbox/v1/oauth/token',
    SCB_DEEPLINK_API:
        'https://api-sandbox.partners.scb/partners/sandbox/v3/deeplink/transactions',
    SCB_TRANSACTION_API:
        'https://api-sandbox.partners.scb/partners/sandbox/v2/transactions',
    LINE_VERIFY_LIFF_TOKEN_API: 'https://api.line.me/oauth2/v2.1/verify?access_token=',
    LINE_GET_PROFILE_API: 'https://api.line.me/v2/profile',
    LINE_CHANNEL_TOKEN: process.env.LINE_CHANNEL_TOKEN || '',
    LINE_CHANNEL_SECRET: process.env.LINE_CHANNEL_SECRET || '' ,
    FRONT_END_URL: process.env.FRONT_END_URL || ''
}
export default CONSTANT
