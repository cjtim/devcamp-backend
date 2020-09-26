import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import express from 'express'
import router from './router'
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)

app.listen(process.env.PORT, () => {
    console.log(`it's works!,checkit out! http://localhost:${process.env.PORT}`)
})
