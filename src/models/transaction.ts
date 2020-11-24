import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../postgres'
import { Orders } from './order'

interface TransactionInstance extends Model {
    id: string
    paid: boolean
    amount: number
    discount: number
    lineUid: string
    orderId: string
}

export const Transactions = sequelize.define<TransactionInstance>(
    'Transactions',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        paid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        discount: {
            type: DataTypes.DOUBLE,
            defaultValue: 0,
            allowNull: false,
        },
        lineUid: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                key: 'id',
                model: 'Orders',
            },
        },
    },
    {
        timestamps: true,
        modelName: 'Transactions',
    }
)
// Transactions.sync({ alter: true })