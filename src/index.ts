import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import express from 'express'
import router from './router'
import cors from 'cors'
import CONST from './const'
import { sequelize } from './postgres'
import { errorHandle } from './utils/errorHandle'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const corsOption = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
}
app.use(cors(corsOption))
app.use(router)
app.use(errorHandle)

sequelize

app.get('/', (req, res) => res.send('Backend working ♥'))

app.listen(process.env.PORT, () => {
    console.log(`it's works!,checkit out! http://localhost:${process.env.PORT}`)
})
