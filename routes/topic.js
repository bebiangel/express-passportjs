var express = require("express");
var router = express.Router();
var path = require("path");
var fs = require("fs");
var sanitizeHtml = require("sanitize-html");
var template = require("../lib/template");
var auth = require("../lib/auth");

router.get("/create", (request, response) => {
  //
  if (!auth.isOwner(request, response)) {
    response.redirect("/");
    return false;
  }
  var title = "WEB - create";
  var list = template.list(request.list);
  var html = template.HTML(
    title,
    list,
    `
        <form action="/topic/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p><textarea name="description" placeholder="description"></textarea></p>
          <p><input type="submit"></p>
        </form>
        `,
    ``,
    auth.statusUI(request, response)
  );
  response.send(html);
});

router.post("/create_process", (request, response) => {
  //
  if (!auth.isOwner(request, response)) {
    response.redirect("/");
    return false;
  }
  var post = request.body;
  var title = post.title;
  var description = post.description;
  fs.writeFile(`data/${title}`, description, "utf8", function(err) {
    response.redirect(`/topic/${title}`);
  });
});

router.get("/update/:pageId", (request, response) => {
  //
  if (!auth.isOwner(request, response)) {
    response.redirect("/");
    return false;
  }
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`, "utf8", function(err, description) {
    var title = request.params.pageId;
    var sanitizedTitle = sanitizeHtml(title);
    var sanitizeDescription = sanitizeHtml(description);
    var list = template.list(request.list);
    var html = template.HTML(
      title,
      list,
      `        
          <form action="/topic/update_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <p><input type="text" name="title" placeholder="title" value=${sanitizedTitle}></p>
            <p><textarea name="description" placeholder="description">${sanitizeDescription}</textarea></p>
            <p><input type="submit"></p>
          </form>
          `,
      `<a href="/topic/create">create</a> <a href="/update/${sanitizedTitle}">update</a>`,
      auth.statusUI(request, response)
    );
    response.send(html);
  });
});

router.post("/update_process", (request, response) => {
  //
  if (!auth.isOwner(request, response)) {
    response.redirect("/");
    return false;
  }
  var post = request.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function(err) {
    fs.writeFile(`data/${title}`, description, "utf8", function(err) {
      response.redirect(`/topic/${title}`);
    });
  });
});

router.post("/delete_process", (request, response) => {
  //
  if (!auth.isOwner(request, response)) {
    response.redirect("/");
    return false;
  }
  var post = request.body;
  var id = post.pageId;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function(error) {
    response.redirect("/");
  });
});

router.get("/:pageId", function(request, response, next) {
  //
  var filteredId = path.parse(request.params.pageId).base;
  fs.readFile(`data/${filteredId}`, "utf8", function(err, description) {
    //
    if (err) {
      next(err);
    } else {
      var title = request.params.pageId;
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizeDescription = sanitizeHtml(description);
      var list = template.list(request.list);
      var html = template.HTML(
        sanitizedTitle,
        list,
        `<h2>${sanitizedTitle}</h2>${sanitizeDescription}`,
        ` <a href="/topic/create">create</a> 
            <a href="/topic/update/${sanitizedTitle}">update</a>
            <form action="/topic/delete_process" method="post">
              <input type="hidden" name="pageId" value="${sanitizedTitle}">
              <input type="submit" value="delete">
            </form>`,
        auth.statusUI(request, response)
      );
      response.send(html);
    }
  });
});

module.exports = router;
