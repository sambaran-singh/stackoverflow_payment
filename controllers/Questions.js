import mongoose from "mongoose";
import Question from "../models/Question.js";
import Questions from "../models/Question.js";

export const AskQuestion = async (req, res) => {
  const postQuestionData = req.body;
  const postQuestion = new Questions({ ...postQuestionData });
  try {
    await postQuestion.save();
    res.status(200).json("Posted a question Sucessfully");
  } catch (error) {
    console.log(error);
    res.status(409).json("Couldnt post a new Question ");
  }
};

export const getAllQuestions = async (req, res) => {
  try {
    const questionList = await Questions.find();
    res.status(200).json(questionList);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return req.status(404).send("question unavailable");
  }
  try {
    await Questions.findByIdAndRemove(_id);
    res.status(200).json({ message: " Sucessfully deleted..." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const voteQuestion = async (req, res) => {
  const { id: _id } = req.params;
  const { value, userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ message: "Questions not found .." });
  }
  try {
    const question = await Question.findById(_id);
    const upIndex = question.upVote.findIndex((id) => id === String(userId));
    const downIndex = question.downVote.findIndex(
      (id) => id === String(userId)
    );

    if (value === "upvote") {
      if (downIndex !== -1) {
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
      }
      if (upIndex === -1) {
        question.upVote.push(userId);
      } else {
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }
    }

    if (value === "downvote") {
      if (upIndex !== -1) {
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }
      if (downIndex === -1) {
        question.downVote.push(userId);
      } else {
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
      }
    }

    await Question.findByIdAndUpdate(_id, question);
    res.status(200).json({ message: " Voted Successfully.." });
  } catch (error) {
    res.status(400).json({ message: "Cant update the vote ... ERROR" });
  }
};
