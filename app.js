import express from "express";
import mongoose from "mongoose";
import mockTasks from "./data/mock.js";
import { DATABASE_URL } from "./env.js";
import Task from "./models/Task.js";

mongoose.connect(DATABASE_URL).then(() => console.log("Connented to DB"));

const app = express();
// req의 contentType이 app ~ json일 경우 body 파싱 수 js 객체로 만들어줌
app.use(express.json());

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

app.set("port", process.env.PORT || 3000);

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

app.patch("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = mockTasks.find((task) => task.id === id);

  if (task) {
    Object.keys(req.body).forEach((key) => {
      task[key] = req.body[key];
    });
    task.updatedAt = new Date();

    res.send(task);
  } else res.status(404).send({ message: "Cannot find given id. " });
});

app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = mockTasks.findIndex((task) => task.id === id);

  if (idx >= 0) {
    mockTasks.splice(idx, 1);
    res.sendStatus(204);
  } else res.status(404).send({ message: "Cannot find given id. " });
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "Server Started!");
});
