var express = require("express");
var router = express.Router();
var path = require("path");
var fs = require("fs");
var sanitizeHtml = require("sanitize-html");
var template = require("../lib/template.js");

var authData = {
  email: "jwhan@gmail.com",
  password: "1234",
  nickname: "jaewoos"
};

router.get("/login", (request, response, next) => {
  //
  var title = `WEB-Login`;
  var sanitizedTitle = sanitizeHtml(title);
  var list = template.list(request.list);
  var html = template.HTML(
    sanitizedTitle,
    list,
    ` 
    <form action="/auth/login_process" method="post">
      <p><input type="text" name="email" placeholder="email"></p>
      <p><input type="password" name="password" placeholder="password"></p>
      <p><input type="submit" value="login"></p>
    </form>
    `
  );
  response.send(html);
});

router.post("/login_process", (request, response) => {
  //
  var post = request.body;
  var email = post.email;
  var password = post.password;
  if (email === authData.email && password === authData.password) {
    request.session.is_logined = true;
    request.session.nickname = authData.nickname;
    request.session.save(() => response.redirect(`/`));
  } else {
    response.send("Who?");
  }
});

router.get("/logout", (request, response) => {
  //
  request.session.destroy(err => {
    console.log("error :", err);
    response.redirect("/");
  });
});

module.exports = router;
