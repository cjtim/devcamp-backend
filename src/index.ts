import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import express from 'express'
import session from 'express-session'
import router from './router'
import cors from 'cors'
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const corsOption = {
    origin: ['https://localhost:3000', 'https://restaurant-helper-liff.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
}
app.use(cors(corsOption))
app.use(session({ secret: 'backend'}))
app.use(router)

app.listen(process.env.PORT, () => {
    console.log(`it's works!,checkit out! http://localhost:${process.env.PORT}`)
})
