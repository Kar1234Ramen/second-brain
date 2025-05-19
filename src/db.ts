import mongoose, { Schema, model } from "mongoose";

mongoose.connect(
  "mongodb+srv://ramenkar8:qTmxw23DMCPhEgc3@secondbrain.abzuag0.mongodb.net/brainly"
);

const userSchema = new Schema({
  userName: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    unique: true,
  },
});

export const userModel = model("User", userSchema);

const contentTypes = ["image", "video", "article", "audio"]; // Extend as needed

const contentSchema = new Schema({
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

export const contentModel = model("Content", contentSchema);
