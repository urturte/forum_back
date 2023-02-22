import express from "express";
const router = express.Router();
import * as questionsController from "../controllers/question.js";
import auth from "../middlewares/auth.js";

router.post("/question", auth, questionsController.askQuestion);

router.get("/questions", questionsController.getAllQuestions);

router.delete("/question/:id", auth, questionsController.deleteQuestionById);

router.post("/answer/:id", auth, questionsController.addAnswer);

router.get("/answers/:id", questionsController.getQuestionsByIdWithAnswers);

router.delete("/answer/:id", auth, questionsController.deleteAnswerById);

export { router };
