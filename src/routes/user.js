import express from "express";

const app = express();
app.use(express.json());
app.set("port", process.env.PORT || 3000);

function validatePassword(req, res, next) {
  const { password } = req.query;

  if (password.length < 6) {
    res.status(400).json({ message: "비밀번호는 6자 이상이어야 합니다." });
  } else {
    next();
  }
}

app.patch("/me", validatePassword, (req, res) => {
  res.status(200).json({ message: "사용자 정보가 수정되었습니다." });
});

app.listen(app.get("port"), () => {
  console.log("Server is lintening on port 3000");
});

// User router
const userRouter = express.Router();

userRouter
  .route("/")
  .get((req, res, next) => {
    res.send({ message: "사용자 목록 보기" });
  })
  .post((req, res, next) => {
    res.send({ message: "사용자 추가하기" });
  });

userRouter
  .route("/:id")
  .patch((req, res, next) => {
    res.send({ message: "사용자 수정하기" });
  })
  .delete((req, res, next) => {
    res.send({ message: "사용자 삭제하기" });
  });

function adminOnly(req, res, next) {
  const authorization = req.get("Authorization");

  if (authorization) {
    next();
  } else {
    res.status(401).send({ message: "권한이 없습니다" });
  }
}

app.use("/users", adminOnly, userRouter);

export default userRouter;
