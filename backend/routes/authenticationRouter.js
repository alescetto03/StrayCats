import express from "express";
import { AuthController } from "../controllers/AuthController.js";

export const authenticationRouter = express.Router();

authenticationRouter.get("/signup", (req, res) => {
    res.render("signup");
});

authenticationRouter.post("/signup", (req, res, next) => {
    AuthController.registerUser(req).then((user) => {
        res.json(user);
    }).catch((err) => {
        next({status: 500, message: "Could not save user"});
    })        
});

authenticationRouter.post("/login", async (req, res) => {
    let isAuthenticated = await AuthController.checkUserCredentials(req).then(result => result);
    if(isAuthenticated) {
        res.json(AuthController.issueToken(req.body.usr));
    } else {
        res.status(401);
        res.json({error: "Invalid credentials. Try again."});
    }
});