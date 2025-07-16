import { Sequelize } from "sequelize";
import { createModel as createUserModel } from "./User.js";
import { createModel as createCatModel } from "./Cat.js";

import 'dotenv/config.js';

export const database = new Sequelize(process.env.DB_CONNECTION_URI, {
    dialect: process.env.DIALECT
});

createUserModel(database);
export const User = database.models.User;
createCatModel(database);
export const Cat = database.models.Cat;

User.hasMany(Cat, { foreignKey: 'authorUsername', as: "catsInserted" });
Cat.belongsTo(User, { foreignKey: 'authorUsername', as: "author" })

let database_mode;

if (process.env.REGENERATE_DB == "true") {
    database_mode = {force: true}
} else {
    database_mode = {alter: true}
}

database.sync(database_mode).then(async () => {
    console.log("Database synced correctly");

    
    if (database_mode.force) {
        await populate();
    }
}).catch( err => {
    console.err("Error with database synchronization: " + err.message);
});

async function populate() {
    const cats = [
    {
        catId: 1,
        title: 'Gatto curioso',
        description: 'Questo gatto ama esplorare i tetti della città.',
        latitude: 40.89080136153374,
        longitude: 14.23919709737278,
        photo: 'cat1.jpg',
    },
    {
        catId: 2,
        title: 'Gatto sonnacchioso',
        description: 'Passa le sue giornate dormendo al sole.',
        latitude: 40.8903958325175,
        longitude: 14.240055404254445,
        photo: 'cat2.jpg',
    },
    {
        catId: 3,
        title: 'Gatto randagio',
        description: 'Compare sempre all’ora di pranzo!',
        latitude: 40.89140965039781,
        longitude: 14.237909637050285,
        photo: 'cat3.jpg',
    },
    {
        catId: 4,
        title: 'Gatto affettuoso',
        description: 'Ama essere coccolato da tutti.',
        latitude: 40.890914909212874,
        longitude: 14.240978084152236,
        photo: 'cat4.jpg',
    },
    {
        catId: 5,
        title: 'Gatto furtivo',
        description: 'Si muove nell’ombra come un ninja.',
        latitude: 40.8919611608008,
        longitude: 14.236128650270832,
        photo: 'cat5.jpg',
    },
];

await Cat.bulkCreate(cats);
console.log("5 gatti inseriti nel database.");
}