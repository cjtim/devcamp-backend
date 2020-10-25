import { DataTypes } from 'sequelize'
import { sequelize } from '../postgres'
export const Orders = sequelize.define(
    'Orders',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
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
