import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import express from 'express'
import router from './router'
import cors from 'cors'
import { testDatabase } from './postgres'
import { errorHandle } from './utils/errorHandle'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const corsOption = {
    origin: ['*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
}
app.use(cors(corsOption))
app.use(router)
app.use(errorHandle)

app.get('/', (req, res) => res.send('Backend working ♥'))

const listen = app.listen(process.env.PORT, async () => {
    await testDatabase()
    console.log(`it's works!,checkit out! http://localhost:${process.env.PORT}`)
})

export { listen }
