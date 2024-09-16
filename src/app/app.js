import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import Task from "../../models/Task.js";

dotenv.config();

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connented to DB"));

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000/"],
};

app.use(cors(corsOptions));
// req의 contentType이 app ~ json일 경우 body 파싱 수 js 객체로 만들어줌
app.use(express.json());
app.set("port", process.env.PORT || 3000);

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (error) {
      if (error.name === "ValidationError") {
        res.status(400).send({ message: error.message });
      } else if (error.name === "CastError") {
        res.status(404).send({ message: "Cannot find given id." });
      } else {
        res.status(500).send({ message: error.message });
      }
    }
  };
}

app.get(
  "/tasks",
  asyncHandler(async (req, res) => {
    /**
     * 쿼리 파라미터
     * - sort: "oldest"인 경우 오래된 태스크 기준, 나머지 경우 새로운 태스크 기준
     * - count: 태스크 개수
     */
    const sort = req.query.sort;
    const count = Number(req.query.count);

    const sortOption = { createdAt: sort === "olderst" ? "asc" : "desc" };

    const tasks = await Task.find().sort(sortOption).limit(count);

    res.send(tasks);
  })
);

app.get(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);

    if (task) res.send(task);
    else res.status(404).send({ message: "Cannot find given id. " });
  })
);

app.post(
  "/tasks",
  asyncHandler(async (req, res) => {
    const newTasks = await Task.create(req.body);

    res.status(201).send(newTasks);
  })
);

app.patch(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);

    if (task) {
      Object.keys(req.body).forEach((key) => {
        task[key] = req.body[key];
      });
      await task.save();

      res.send(task);
    } else res.status(404).send({ message: "Cannot find given id. " });
  })
);

app.delete(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const task = await Task.findByIdAndDelete(id);

    if (task) res.sendStatus(204);
    else res.status(404).send({ message: "Cannot find given id. " });
  })
);

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "Server Started!");
});
