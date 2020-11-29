import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../postgres'

interface RestaurantInstance extends Model {
    id: string
    name: string
    description: string
    address: string
    phone: string
    imgUrl: Array<string>
    lineUid: string
}

export const Restaurants = sequelize.define<RestaurantInstance>(
    'Restaurants',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        phone: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        imgUrl: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            allowNull: true,
        },
        lineUid: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        timestamps: true,
        modelName: 'Restaurants',
    }
)
// Restaurants.sync({alter: true})
