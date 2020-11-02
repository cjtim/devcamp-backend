import { DataTypes } from 'sequelize'
import { ORDER_STATUS } from '../enum'
import { sequelize } from '../postgres'
import { enumToList } from '../utils/enumToArray'
export const Orders = sequelize.define(
    'Orders',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        status: {
            type: DataTypes.ENUM({ values: enumToList(ORDER_STATUS) }),
            allowNull: false
        },
        selectedMenu: {
            type: DataTypes.ARRAY(DataTypes.JSONB),
            allowNull: false,
        },
        lineUid: {
            type: DataTypes.STRING,
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
        timestamps: true,
        modelName: 'Orders',
    }
)
