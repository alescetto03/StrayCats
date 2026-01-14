import express from "express";
import morgan from "morgan";
import cors from "cors";

import { authenticationRouter } from "./routes/authenticationRouter.js";
import { enforceAuthentication } from "./middlewares/authorization.js";
import { catRouter } from "./routes/catRouter.js";
import { commentRouter } from "./routes/commentRouter.js";

const app = express();
const PORT = 3000;

app.use(morgan("dev"));
app.use(cors());
app.use(express.json({limit: "5mb"}));

app.use(express.json({ limit: "1000mb" }));
app.use(express.urlencoded({ limit: "1000mb", extended: true }));
app.use('/public', express.static('public'));


//routes
app.use(authenticationRouter);
app.use(catRouter);
app.use(commentRouter)

//error handler
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.status || 500).json({
    code: err.status || 500,
    description: err.message || "An error occurred",
  });
});

app.listen(PORT);
