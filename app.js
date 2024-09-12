import express from "express";
import tasks from "./data/mock.js";

const app = express();

app.set("port", process.env.PORT || 3000);

app.get("/tasks", (req, res) => {
  /**
   * 쿼리 파라미터
   * - sort: "oldest"인 경우 오래된 태스크 기준, 나머지 경우 새로운 태스크 기준
   * - count: 태스크 개수
   */
  const sort = req.query.sort;
  const count = Number(req.query.count);

  const compareFn =
    sort === "oldest"
      ? (a, b) => a.createAt - b.createAt
      : (a, b) => b.createAt - a.createAt;

  let newTasks = tasks.sort(compareFn);

  if (count) {
    newTasks = newTasks.slice(0, count);
  }

  res.send(newTasks);
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "Server Started!");
});
