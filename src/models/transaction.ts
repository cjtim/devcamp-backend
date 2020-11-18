import { DataTypes } from 'sequelize'
import { PAYMENT_METHOD } from '../enum'
import { sequelize } from '../postgres'
import { enumToList } from '../utils/enumToArray'
import { Orders } from './order'
export const Transactions = sequelize.define(
    'Transactions',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        method: {
            type: DataTypes.ENUM({
                values: enumToList(PAYMENT_METHOD),
            }),
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
        chargeId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lineUid: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        orderId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                key: 'id',
                model: 'Orders'
            },
        },
    },
    {
        timestamps: true,
        modelName: 'Transactions',
    }
)
Orders.hasMany(Transactions, {
    foreignKey: 'orderId'
})
Transactions.belongsTo(Orders, {
    foreignKey: 'orderId'
})
