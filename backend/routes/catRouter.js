import express from "express";
import { CatController } from "../controllers/CatController.js";
import multer from "multer";
import path from "path";

export const catRouter = new express.Router();

catRouter.get("/cats", (req, res, next) => {
  CatController.getAllCats(req)
    .then((cats) => {
      console.log(cats);
      res.json(cats);
    })
    .catch((err) => {
      next(err);
    });
});

catRouter.get("/cats/:id", (req, res, next) => {
  CatController.findById(req)
    .then((item) => {
      if (item) res.json(item);
      else next({ status: 404, message: "Cat not found" });
    })
    .catch((err) => {
      next(err);
    });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

catRouter.post("/cats", upload.single("image"), (req, res, next) => {
  if (req.file) req.body.imagePath = req.file.path;

  CatController.saveCat(req)
    .then((item) => {
      res.status(201).json(item);
    })
    .catch((err) => {
      next(err);
    });
});
