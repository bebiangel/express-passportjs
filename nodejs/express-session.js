var express = require("express");
var session = require("express-session");
var FileStore = require("session-file-store")(session);

var app = express();

// secret : 세션 ID 인증하는데 사용되는 문자열. 중요한 정보이므로 상업용으로 배포시에는 변수처리로 구현해야함
// resave : 요청중에 세션 정보가 수정되지 않은경우에도 세션이 저장소에 다시 저장되도록한다.
// false인 경우 수정되지 않으면 저장되지 않도록한다.
// saveUnititialized: 새 세션이지만 수정되지 않은 세션은 초기화 되지 않도록 한다.
// false일 경우 서버의 부담을 줄이고 클라이언트가 세션없이 여러개의 병렬 요청을 하도록한다.
// session 미들웨어가 request에 내부적으로 추가해준다.
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
  })
);

app.get("/", function(req, res, next) {
  //
  console.log(req.session);
  if (req.session.num === undefined) {
    req.session.num = 1;
  } else {
    req.session.num = req.session.num + 1;
  }
  res.send(`View : ${req.session.num}`);
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));
