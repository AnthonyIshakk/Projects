import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import "./src/models/db.js";
import Router from "./src/routes/prod_routes.js";
import userRouter from "./src/routes/user_routes.js";
import merchantRouter from "./src/routes/merchant_routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/test", (req, res) => {
  res.send("Anthony");
});

app.use("/products", Router);
app.use("/user", userRouter);
app.use("/merchants", merchantRouter);

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
