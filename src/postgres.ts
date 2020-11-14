import { Sequelize } from 'sequelize'
import CONST from './const'
// Database
export const sequelize = new Sequelize(
    CONST.PSQL_DATABASE,
    CONST.PSQL_USERNAME,
    CONST.PSQL_PASSWORD,
    {
        host: CONST.PSQL_HOSTNAME,
        dialect: 'postgres',
        ssl: true,
        dialectOptions: {
            ssl: { require: true },
        },
    }
)

async function testDatabase(): Promise<boolean> {
    try {
        await sequelize.authenticate()
        console.log('Connection has been established successfully.')
        return true
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
    return false;
}
export { testDatabase }
