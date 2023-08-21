// import mongoose from "mongoose";

// const QuestionSchema = mongoose.Schema({
//   questionTitle: {
//     type: String,
//     required: "Question must have question title",
//   },
//   questionBody: { type: String, required: "Question must have question body" },
//   questionTags: {
//     type: [String],
//     required: "Question must have question tags",
//   },
//   noOfAnswers: { type: Number, default: 0 },
//   userPosted: { type: String, required: "Question must have an author" },
//   userId: { type: String },
//   askedOn: { type: Date, default: Date.now },
//   upvote: { type: [String], default: [] },
//   downVotes: { type: [String], default: [] },
//   answer: [
//     {
//       answerBody: String,
//       userAnswered: String,
//       answeredOn: { type: Date, default: Date.now },
//       userId: String,
//     },
//   ],
// });

// export default mongoose.model("Questions", QuestionSchema);

import mongoose from "mongoose";

const QuestionSchema = mongoose.Schema({
  questionTitle: { type: String, required: "Question must have a title" },
  questionBody: { type: String, required: "Question must have a body" },
  questionTags: { type: [String], required: "Question must have a tags" },
  noOfAnswers: { type: Number, default: 0 },
  upVote: { type: [String], default: [] },
  downVote: { type: [String], default: [] },
  userPosted: { type: String, required: "Question must have an author" },
  userId: { type: String },

  askedOn: { type: Date, default: Date.now },
  answer: [
    {
      answerBody: String,
      userAnswered: String,
      userId: String,
      answeredOn: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("Question", QuestionSchema);
