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
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imgUrl: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
        },
        lineUid: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        modelName: 'Restaurants',
    }
)
