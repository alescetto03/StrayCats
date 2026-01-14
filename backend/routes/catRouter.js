import express from "express";
import { CatController } from "../controllers/CatController.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { enforceAuthentication } from "../middlewares/authorization.js";
import { Cat } from "../models/Database.js";

export const catRouter = new express.Router();

const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

catRouter.get("/cats", (req, res, next) => {
  CatController.getAllCats(req)
    .then((cats) => {
      console.log(cats);
      res.json(cats);
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

catRouter.get("/cats/:id", (req, res, next) => {
  CatController.findById(req)
    .then((cat) => {
      if (cat) res.json(cat);
      else next({ status: 404, message: "Cat not found" });
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

catRouter.post("/cats", enforceAuthentication, (req, res, next) => {
  CatController.saveCat({
    title: req.body.title,
    description: req.body.description,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    authorUsername: req.username,
  })
    .then((cat) => {
      res.status(201).json(cat);
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

const catAvatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/cats/')
    },
    filename: function (req, file, cb) {
        console.log(file.originalname)
        cb(null, req.params.id + path.extname(file.originalname))
    }
})

const catAvatarUpload = multer({ 
    storage: catAvatarStorage,
    limits: {fileSize: FILE_SIZE_LIMIT}
 })

catRouter.post("/cats/:id/image", enforceAuthentication, catAvatarUpload.single('image'), async (req, res) => {
  try {
      const cat = await Cat.findByPk(req.params.id);
      if (!cat) return res.sendStatus(404);

      if (req.file) {
        cat.image = req.file.filename;
        await cat.save();
      }

      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
});