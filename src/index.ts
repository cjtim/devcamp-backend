import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import express from 'express'
import router from './router'
import BucketServices from './services/bucket.services'
import OmiseServices from './services/omise.services'
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)

app.listen(process.env.PORT, () => {
    console.log(`it's works!,checkit out! http://localhost:${process.env.PORT}`)
});

// OmiseServices.createPrompPay(2000)
// OmiseServices.search()
// (async() => {
//     console.log(await BucketServices.add('nodejs/', 'package.json'))
// })()