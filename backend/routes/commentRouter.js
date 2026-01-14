import express from "express";
import { CommentController } from "../controllers/CommentController.js";
import { enforceAuthentication } from "../middlewares/authorization.js";

export const commentRouter = new express.Router();

commentRouter.post("/cats/:id/comments", enforceAuthentication, (req, res, next) => {
    CommentController.saveComment({
        text: req.body.text,
        authorUsername: req.username,
        catId: req.params.id
    }).then((comment) => {
        res.status(201).json(comment)
    }).catch((err) => {
        console.log(err)
        res.sendStatus(500)
    })
});

commentRouter.get("/cats/:id/comments", (req, res, next) => {
    CommentController.getCommentsOfCat(req.params.id)
    .then((comments) => {
        if (comments) {
            res.json(comments)
        }
        else sendStatus(404)
    })
    .catch((err) => {
        res.sendStatus(500)
    })
})