var express = require("express");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
var compression = require("compression");

//
var cookie = require("cookie");
var helmet = require("helmet");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
var flash = require("connect-flash");

app.use(helmet());

// public directory 안에서 찾는다.
app.use(express.static("public"));
// use middleware => request의 body에 접근 가능하도록 한다.
app.use(bodyParser.urlencoded({ extended: false }));
// source compress
app.use(compression());

app.use(
  session({
    secret: "asadlfkj!@#!@#dfgasdg",
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
  })
);
app.use(flash());
// flash message는 1회용 메세지

var passport = require("./lib/passport")(app);

// * 모든요청을 받지만 get방식만 받도록 함.
app.get("*", function(request, response, next) {
  //
  fs.readdir("./data", function(error, filelist) {
    request.list = filelist;
    next();
  });
});

// route, routing
var indexRouter = require("./routes/index");
var topicRouter = require("./routes/topic");
var authRouter = require("./routes/auth")(passport);

// app.get('/', (req, res) => res.send("Hello World"));
app.use("/", indexRouter);
// 하위 router는 topic이 필요없다.
app.use("/topic", topicRouter);
app.use("/auth", authRouter);

app.use((request, response, next) => {
  response.status(404).send(`Sorry can't find that!`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));
