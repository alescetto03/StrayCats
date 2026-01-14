import { Sequelize } from "sequelize";
import { createModel as createUserModel } from "./User.js";
import { createModel as createCatModel } from "./Cat.js";
import { createModel as createCommentModel } from "./Comment.js";

import 'dotenv/config.js';

export const database = new Sequelize(process.env.DB_CONNECTION_URI, {
    dialect: process.env.DIALECT
});

createUserModel(database);
export const User = database.models.User;
createCatModel(database);
export const Cat = database.models.Cat;
createCommentModel(database);
export const Comment = database.models.Comment;

User.hasMany(Cat, { foreignKey: 'authorUsername', as: "catsInserted" });
User.hasMany(Comment, { foreignKey: 'authorUsername', as: "comments" })
Cat.belongsTo(User, { foreignKey: 'authorUsername', as: "author" })
Cat.hasMany(Comment, { foreignKey: 'catId', as: "comments" })
Comment.belongsTo(User, { foreignKey: 'authorUsername', as: "author" })
Comment.belongsTo(User, { foreignKey: 'catId', as: "cat" })

let database_mode;

if (process.env.REGENERATE_DB == "true") {
    database_mode = {force: true}
} else {
    database_mode = {force: false}
}

database.sync(database_mode).then(async () => {
    console.log("Database synced correctly");
    if (database_mode.force) {
        await populate();
    }
}).catch( err => {
    console.error("Error with database synchronization: " + err.message);
});

async function populate() {
    const users = [
        {
            username: 'admin',
            password: process.env.ADMIN_PW
        }
    ]
    const cats = [
        {
            title: 'Gatto curioso',
            description: `### Un vero curiosone  
**Questo micio è un vero esploratore!**  
> Ama arrampicarsi sui tetti della città e osservare il mondo dall’alto.  
  
**Caratteristiche:**  
- Spirito d’avventura  
- Fiuto eccezionale  
- Sempre in cerca di nuove altezze`,
            latitude: 40.89080136153374,
            longitude: 14.23919709737278,
            image: '1.jpeg',
            authorUsername: 'admin'
        },
        {
            title: 'Gatto sonnacchioso',
            description: `### Ha sempre sonno  
*Il re del relax.*  
> Passa le sue giornate dormendo al sole.  
  
**Routine quotidiana:**  
1. Colazione  
2. Sonno mattutino  
3. Sonno pomeridiano  
4. Cena e ancora sonno`,
            latitude: 40.8903958325175,
            longitude: 14.240055404254445,
            image: '2.jpg',
            authorUsername: 'admin'
        },
        {
            title: 'Gatto randagio',
            description: `### Gatto randagio  
> *Compare sempre all’ora di pranzo!*  
  
**Curiosità:**  
- Ha un orologio biologico impeccabile  
- Ti osserva da lontano finché non servi il cibo  
- Ha conquistato tutti i cuori del quartiere`,
            latitude: 40.89140965039781,
            longitude: 14.237909637050285,
            image: '3.jpg',
            authorUsername: 'admin'
        },
        {
            title: 'Gatto affettuoso',
            description: `### Gatto affettuoso  
*Un vero amante delle coccole.*  
> Ama essere accarezzato da tutti — non rifiuta mai una carezza!  
  
**Punti di forza:**  
- Morbidissimo  
- Socievole  
- Fa le fusa appena lo guardi`,
            latitude: 40.890914909212874,
            longitude: 14.240978084152236,
            image: '4.jpeg',
            authorUsername: 'admin'
        },
        {
            title: 'Gatto furtivo',
            description: `### Gatto furtivo  
> Si muove nell’ombra come un **vero ninja**.  
  
**Abilità speciali:**  
> - Passi silenziosi  
> - Invisibile quando vuole  
> - Ama la notte  
  
> "Non tutti i supereroi indossano mantelli... alcuni hanno i baffi."`,
            latitude: 40.8919611608008,
            longitude: 14.236128650270832,
            image: '5.webp',
            authorUsername: 'admin'
        }
    ];
    await User.bulkCreate(users);
    await Cat.bulkCreate(cats);
    console.log("Database population done");
}