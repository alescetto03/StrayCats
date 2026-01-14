import { Cat } from "../models/Database.js";

export class CatController {
    static async getAllCats(req) {
        return Cat.findAll();
    }

    static async saveCat(data){
        let cat = Cat.build(data);
        return cat.save();
    }

    static async findById(req){
        return Cat.findByPk(req.params.id);
    }
}