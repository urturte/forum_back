import { response } from "express";
import QuestionSchema from "../models/questionModel.js";
import AnswerSchema from "../models/answerModel.js";
import UserSchema from "../models/userModel.js";
import auth from "../middlewares/auth.js";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

async function askQuestion(req, res) {
  const question = new QuestionSchema({
    title: req.body.title,
    dateCreated: new Date(),
    answersIds: [],
    answered: false,
  });
  question
    .save()
    //   ;
    //   UserSchema.updateOne(
    //     { _id: req.body.userId },
    //     {
    //       $push: { questions: question._id },
    //     }
    //   )
    //     .exec()
    .then((result) => {
      return res.status(200).json({
        statusMessage: "Question was submitted",
        question: result,
      });
    })
    .catch((err) => {
      console.log("Error occured", err);
      res.status(404).json({ response: "Error try again" });
    });
}

async function getAllQuestions(req, res) {
  QuestionSchema.find()
    // .sort("name")
    .then((result) => {
      return res.status(200).json({ questions: result });
    })
    .catch((err) => {
      console.log("err", err);
      res.status(404).json({ response: "Something went wrong" });
    });
}

function deleteQuestionById(req, res) {
  QuestionSchema.deleteOne({ _id: req.params.id })
    .then((result) => {
      return res.status(200).json({
        statusMessage: "Question was deleted succesfully",
        deletedQuestion: result,
      });
    })
    .catch((err) => {
      console.log("err", err);
      res.status(404).json({ response: "Something went wrong" });
    });
}

async function addAnswer(req, res) {
  const answer = new AnswerSchema({
    content: req.body.content,
    dateCreated: new Date(),
    questionId: req.params.id,
  });
  answer
    .save()
    .then((result) => {
      console.log(result);

      AnswerSchema.updateOne({ _id: result._id }, { id: result._id }).exec();

      QuestionSchema.updateOne(
        { _id: req.params.id },
        { $push: { answersIds: result._id.toString() } }
      ).exec();

      return res.status(200).json({
        statusMessage: "Question answered successfully",
        result: result,
      });
    })
    .catch((err) => {
      console.log("Error occured", err);
      res.status(404).json({ response: "Error try again" });
    });
}

function getQuestionsByIdWithAnswers(req, res) {
  AnswerSchema.find({ questionId: req.params.id })
    .then((result) => {
      return res.status(200).json({
        statusMessage: "Answers were found",
        answersToQuestion: result,
      });
    })
    .catch((err) => {
      console.log("err", err);
      res.status(404).json({ response: "Something went wrong" });
    });

  //   .aggregate([
  //     {
  //       $lookup: {
  //         from: "test.answers",
  //         localField: "answersIds",
  //         foreignField: "_id",
  //         as: "questionAnswers",
  //       },
  //     },
  //     { $match: { _id: new ObjectId(req.params.id) } },
  //   ]).exec();
  //   console.log("data", data);

  //   return res.status(200).json({ questionAnswers: data });
}

function deleteAnswerById(req, res) {
  AnswerSchema.deleteOne({ _id: req.params.id })
    .then((result) => {
      return res.status(200).json({
        statusMessage: "Answer was deleted succesfully",
        deletedAnswer: result,
      });
    })
    .catch((err) => {
      console.log("err", err);
      res.status(404).json({ response: "Something went wrong" });
    });
}

export {
  askQuestion,
  getAllQuestions,
  deleteQuestionById,
  addAnswer,
  getQuestionsByIdWithAnswers,
  deleteAnswerById,
};
