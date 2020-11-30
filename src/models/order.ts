import { DataTypes, Model, Optional } from 'sequelize'
import { ORDER_STATUS } from '../enum'
import { sequelize } from '../postgres'
import { enumToList } from '../utils/enumToArray'
import { Restaurants } from './restaurant'
import { Transactions } from './transaction'

interface OrderInstance extends Model {
    id: number
    status: string
    selectedMenu: Array<any>
    lineUid: string
    restaurantId: string
}

export const Orders = sequelize.define<OrderInstance>(
    'Orders',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM({ values: enumToList(ORDER_STATUS) }),
            allowNull: false,
        },
        selectedMenu: {
            type: DataTypes.ARRAY(DataTypes.JSONB),
            allowNull: false,
        },
        lineUid: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        restaurantId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                key: 'id',
                model: 'Restaurants',
            },
        },
    },
    {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        timestamps: true,
        modelName: 'Orders',
    }
)


Orders.belongsTo(Restaurants, {
    foreignKey: 'restaurantId'
})

Orders.hasMany(Transactions, {
    foreignKey: 'orderId',
})
Transactions.belongsTo(Orders, {
    foreignKey: 'orderId',
})

// Orders.sync({alter: true})