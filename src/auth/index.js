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
