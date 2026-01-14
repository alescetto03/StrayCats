import { DataTypes } from "sequelize";

/**
 * Creates Cat Model
 * @param {Sequelize} database 
 */
export function createModel(database) {
    database.define('Cat', {
        catId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: false,
        },
        longitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    })
}