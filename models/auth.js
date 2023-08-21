import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    about: { type: String },
    tags: { type: [String] },
    joinedOn: { type: Date, default: Date.now },
    subscription: { type: String, default: "Free" },
    lastPostedDate: { type: Date, default: Date.now },
    noOfQuestionsPosted: { type: Number, default: 0 },
    username: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    profilePicture: {
      type: String,
      default:
        "http://res.cloudinary.com/djl0e0ryv/image/upload/v1689407733/socio/profile/iajfbsitldjlpr5neu27.png",
    },
    coverPicture: {
      type: String,
      default:
        "http://res.cloudinary.com/djl0e0ryv/image/upload/v1689407733/socio/cover/kwdoju7cjsgtauvouo1x.jpg",
    },
    followers: [],
    following: [],
    worksAt: String,
    livesIn: String,
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
