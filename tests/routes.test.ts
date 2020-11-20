import request from 'supertest'
import { sequelize } from '../src/postgres'
import { listen as app } from '../src'

beforeAll(() => {
    app
})

describe('GET /', function () {
    test('Expect status 200', async () => {
        const res = await request(app).get('/')
        expect(res.status).toEqual(200)
    })
})
afterAll(async() => {
    await sequelize.close()
    app.close()
})
