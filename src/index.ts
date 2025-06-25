import express from "express";
import jwt from "jsonwebtoken";
import { contentModel, linkModel, userModel } from "./db";
import { Config } from "./config";
import { userMiddleware } from "./middleware";
import { random } from "./utils";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const JWT_PASSWORD = Config.JWT_PASSWORD;

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
  const title = req.body.title;
  const link = req.body.link;
  const type = req.body.type;

  await contentModel.create({
    title,
    link,
    type,
    //@ts-ignore
    userId: req.userId,
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

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  const share = req.body.share;

  if (share) {
    const existingLink = await linkModel.findOne({
      //@ts-ignore
      userId: req.userId,
    });
    if (existingLink) {
      res.json({
        //@ts-ignore
        hash: existingLink.hash,
      });
      return;
    }

    const hash = random(10);
    await linkModel.create({
      //@ts-ignore
      userId: req.userId,
      hash: hash,
    });

    res.json({
      hash: hash,
    });
  } else {
    await linkModel.deleteOne({
      //@ts-ignore
      userId: req.userId,
    });

    res.json({
      message: "Removed link",
    });
  }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash = req.params.shareLink;

  const link = await linkModel.findOne({
    hash,
  });

  if (!link) {
    res.status(411).json({
      message: "Sorry incorrect input",
    });
  }
  const content = await contentModel.find({
    //@ts-ignore
    userId: link.userId,
  });

  const user = await userModel.findOne({
    //@ts-ignore
    _id: link.userId,
  });

  res.json({
    //@ts-ignore
    userName: user?.userName,
    content: content,
  });
});

app.listen(3000);
