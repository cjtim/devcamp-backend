import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../postgres'
import { Restaurants } from './restaurant'

interface MenuInstance extends Model {
    id: string
    name: string
    price: number
    img: string
    restaurantId: string
}

export const Menus = sequelize.define<MenuInstance>(
    'Menus',
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
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        img: {
            type: DataTypes.TEXT,
            allowNull: true,
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
        modelName: 'Menus',
    }
)
Menus.belongsTo(Restaurants, {
    foreignKey: {
        field: 'restaurantId'
    }
})
// Menus.sync({alter: true})