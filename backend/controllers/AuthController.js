import { User } from "../models/Database.js";
import jwt from "jsonwebtoken";

export class AuthController {
    /**
     * Attempts to register an user into the database
     * @param {import("express").Request} req 
     * @returns {Promise<User>}
     */
    static async registerUser(req)  {
        let user = new User({
            username: req.body.usr,
            password: req.body.pwd
        })
        return user.save();
    }

    /**
     * Checks if the user exists in the database and his credentials are correct
     * @param {import("express").Request} req 
     * @returns {Promise<boolean>} 
     */
    static async checkUserCredentials(req)  {
        let user = new User({
            username: req.body.usr,
            password: req.body.pwd
        });
        let found = await User.findOne({ where: { username: user.username, password: user.password } });
        return found !== null;
    }    

    /**
     * Returns a Jwt Token in order to authenticate an user
     * @param {string} username 
     * @returns {string}
     */
    static issueToken(username) {
        return jwt.sign({user:username}, process.env.TOKEN_SECRET, {expiresIn: `${24*60*60}s`});
    }

    /**
     * Verify if the Jwt Token is valid
     * @param {string} token 
     * @param {VerifyCallback<JwtPayload | string>} callback 
     */
    static isTokenValid(token, callback) {
        jwt.verify(token, process.env.TOKEN_SECRET, callback);
    }

    static async canUserModifyCat(user, catId){
        const cat = await Cat.findByPk(catId);
        return cat && cat.author === user;
    }
}