import mongoose from "mongoose";
import { DATABASE_URL } from "../env.js";
import Task from "../models/Task.js";
import data from "./mock.js";

mongoose.connect(DATABASE_URL);

await Task.deleteMany({});
await Task.insertMany(data);

mongoose.connection.close();
