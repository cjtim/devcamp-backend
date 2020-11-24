import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../postgres'

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
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        img: {
            type: DataTypes.STRING,
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
        timestamps: true,
        modelName: 'Menus',
    }
)