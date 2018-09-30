var http = require("http");
var cookie = require("cookie");

http
  .createServer(function(request, response) {
    var cookies = {};
    if (request.headers.cookie !== undefined) {
      cookies = cookie.parse(request.headers.cookie);
    }

    // Expires 명시된 날짜에 쿠키가 사라진다.
    // Max-Age 명시된 기간 이후에 쿠키가 사라진다.
    // HttpOnly JavaScript로는 보이지 않는다. 중요 정보 설정
    response.writeHead(200, {
      "Set-Cookie": [
        "yummy_cookie=choco",
        "tasty_cookie=strawberry",
        `Permanent=cookies; Max-Age=${60 * 60 * 24 * 30}`,
        "Secure=Secure; Secure",
        "HttpOnly=HttopOnly; HttpOnly",
        "Path=Path; Path=/cookie",
        "Domain=Domain; Domain=o2.org"
      ]
    });
    response.end("Cookie");
  })
  .listen(3000);
