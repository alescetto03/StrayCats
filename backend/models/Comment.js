import { DataTypes } from "sequelize";

/**
 * Creates Cat Model
 * @param {Sequelize} database 
 */
export function createModel(database) {
    database.define('Comment', {
        commentId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
            notEmpty: true
        }
    })
}