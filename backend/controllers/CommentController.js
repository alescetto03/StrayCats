import { Cat, Comment } from "../models/Database.js";

export class CommentController {
    static async saveComment(data) {
        let comment = Comment.build(data);
        return comment.save();
    }

    static async getCommentsOfCat(catId) {
        return Comment.findAll({where: { catId: catId }})
    }
}