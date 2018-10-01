var express = require("express");
var router = express.Router();
var path = require("path");
var fs = require("fs");
var sanitizeHtml = require("sanitize-html");
var template = require("../lib/template.js");

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);
db.defaults({ users: [] }).write();

module.exports = function(passport) {
  router.get("/login", function(request, response) {
    var fmsg = request.flash();
    var feedback = "";
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    var title = "WEB - login";
    var list = template.list(request.list);
    var html = template.HTML(
      title,
      list,
      `
      <div style="color:red;">${feedback}</div>
      <form action="/auth/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p>
          <input type="submit" value="login">
        </p>
      </form>
    `,
      ""
    );
    response.send(html);
  });

  router.post(
    "/login_process",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/auth/login",
      failureFlash: true,
      successFlash: true
    })
  );

  router.get("/register", function(request, response) {
    var fmsg = request.flash();
    var feedback = "";
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    var title = "WEB - login";
    var list = template.list(request.list);
    var html = template.HTML(
      title,
      list,
      `
      <div style="color:red;">${feedback}</div>
      <form action="/auth/register_process" method="post">
        <p><input type="text" name="email" placeholder="email" value="jwhan@gmail.com"></p>
        <p><input type="password" name="password" placeholder="password" value="1234"></p>
        <p><input type="password" name="password2" placeholder="password" value="1234"></p>
        <p><input type="text" name="displayName" placeholder="display name" value="jaewoos"></p>
        <p>
          <input type="submit" value="register">
        </p>
      </form>
    `,
      ""
    );
    response.send(html);
  });

  router.post("/register_process", function(request, response) {
    //
    var post = request.body;
    var email = post.email;
    var password = post.password;
    var password2 = post.password2;
    var displayName = post.displayName;
    db.get("users").push({
      email: email,
      password: password,
      displayName: displayName
    }).write;
    response.redirect("/");
  });

  router.get("/logout", function(request, response) {
    request.logout();
    request.session.save(function() {
      response.redirect("/");
    });
  });

  return router;
};
