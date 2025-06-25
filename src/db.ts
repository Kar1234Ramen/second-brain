import { Config } from "./config";
import mongoose, { Schema, model } from "mongoose";

const mongoUri = Config.MONGODB_URI;
mongoose.connect(mongoUri);

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

const contentSchema = new Schema({
  link: { type: String, required: true },
  type: { type: String },
  title: { type: String, required: true },
  tags: { type: String },
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

export const contentModel = model("Content", contentSchema);

const linkSchema = new Schema({
  hash: String,
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

export const linkModel = model("Links", linkSchema);
