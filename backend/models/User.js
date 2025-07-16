import { DataTypes } from "sequelize";
import { createHash } from "crypto";

/**
 * Creates User Model
 * @param {Sequelize} database 
 */
export function createModel(database) {
  database.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        let hash = createHash("sha256");    
        this.setDataValue('password', hash.update(value).digest("hex"));
      }
    }
  });
}