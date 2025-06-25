import dotenv from "dotenv";
dotenv.config();

const { MONGODB_URI, JWT_PASSWORD } = process.env;

if (!MONGODB_URI || !JWT_PASSWORD) {
  throw new Error("Missing environment variables");
}

export const Config = {
  MONGODB_URI,
  JWT_PASSWORD,
};
