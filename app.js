import express from "express";
import tasks from "./data/mock.js";

const app = express();

app.set("port", process.env.PORT || 3000);

app.get("/tasks", (req, res) => {
  res.send(tasks);
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "Server Started!");
});
