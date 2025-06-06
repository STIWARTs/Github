const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    repositories: [
      {
        default: [],
        type: Schema.Types.ObjectId, //pointing to the Repository Schema
        ref: "Repository",
      },
    ], // Array/List of repositories owned/created by the user
    followedUsers: [
      {
        default: [],
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    starRepos: [
      {
        default: [],
        type: Schema.Types.ObjectId,
        ref: "Repository",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema); // Create a User model based on the UserSchema

module.exports = User;
