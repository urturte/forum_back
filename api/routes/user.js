import express from "express";
const router = express.Router();
import * as userController from "../controllers/user.js";

router.post("/register", userController.register);

router.post("/login", userController.login);

export { router };
