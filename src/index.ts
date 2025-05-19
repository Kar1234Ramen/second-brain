import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { contentModel, userModel } from "./db";
import { JWT_PASSWORD } from "./config";
import { userMiddleware } from "./middleware";

const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  try {
    await userModel.create({
      userName: userName,
      password: password,
    });

    res.json({
      message: "User signed up",
    });
  } catch (err) {
    res.status(411).json({
      message: "User already exists",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  const existingUser = await userModel.findOne({
    userName,
    password,
  });
  if (existingUser) {
    const token = jwt.sign(
      {
        id: existingUser._id,
      },
      JWT_PASSWORD
    );

    res.json({
      token,
    });
  } else {
    res.status(403).json({
      message: "Incorrect credentials",
    });
  }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const title = req.body.link;
  const link = req.body.link;
  const type = req.body.type;

  await contentModel.create({
    title,
    link,
    type,
    //@ts-ignore
    userId: req.userId,
    tags: [],
  });

  res.json({
    message: "Content added",
  });
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  const content = await contentModel
    .find({ userId: userId })
    .populate("userId", "userName");
  res.json({
    content,
  });
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const contentId = req.body.contentId;
  try {
    const deleted = await contentModel.deleteOne({
      contentId,
      //@ts-ignore
      userId: req.userId,
    });
  } catch (err) {
    res.status(404).json({
      message: "Content doesn't exist",
    });
  }
});

app.post("/api/v1/brain/share", (req, res) => {});

app.get("/api/v1/brain/:shareLink", (req, res) => {});

app.listen(3000);
