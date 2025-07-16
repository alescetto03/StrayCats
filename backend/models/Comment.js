import { DataTypes } from "sequelize";

/**
 * Creates Cat Model
 * @param {Sequelize} database 
 */
export function createModel(database) {
    database.define('Cat', {
        catId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: Quiz,
                key: 'id'
            }
        },
    })
}