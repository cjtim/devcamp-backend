import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../postgres'

interface UserInstance extends Model {
    id: string
    name: string
    tel: string
    lineUid: string
}

export const Users = sequelize.define<UserInstance>(
    'Users',
    {
        name: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        tel: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        lineUid: {
            type: DataTypes.TEXT,
            primaryKey: true,
            allowNull: false,
        },
    },
    {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        timestamps: true,
        modelName: 'Users',
    }
)
// Users.sync({ alter: true })
