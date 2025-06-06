const mongoose = require("mongoose");
const { Schema } = mongoose;

const RepositorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    content: [
      {
        type: String,
      },
    ],
    visibility: {
      type: Boolean, //true/false for public/private
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User", // Connected to User Schema
      required: true,
    },
    issues: [
      {
        type: Schema.Types.ObjectId,
        ref: "Issue", // Connected to Issue Schema
      },
    ],
  },
  { timestamps: true }
);

const Repository = mongoose.model("Repository", RepositorySchema);
module.exports = Repository;
