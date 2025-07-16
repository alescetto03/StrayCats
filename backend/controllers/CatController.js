import { Cat } from "../models/Database.js";

export class CatController {
    static async getAllCats(req) {
        return Cat.findAll();
    }

    static async saveCat(req){
        let cat = Cat.build(req.body);
        cat.author = req.username;
        return cat.save();
    }

    static async findById(req){
        return Cat.findByPk(req.params.id);
    }
}