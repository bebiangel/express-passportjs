module.exports = function(app) {
  var authData = {
    email: "jwhan@gmail.com",
    password: "1234",
    nickname: "jaewoos"
  };

  // session을 내부적으로 사용하기 때문에 session 코드 다음에 있어야함.
  var passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy;

  // initialize middleware 사용
  app.use(passport.initialize());
  app.use(passport.session());

  // 없으면 Failed to serialize user into session 에러 뜸
  // login에 성공하면 session store에 저장하고 한번만 호출
  passport.serializeUser(function(user, done) {
    console.log("user", user);
    done(null, user.email);
  });

  // 저장된 데이터를 기준으로 필요한 데이터를 조회할때 사용
  passport.deserializeUser(function(id, done) {
    console.log(id);
    done(null, authData);
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      function(username, password, done) {
        console.log("!!!!!!!!!!");
        console.log(username, password, done);
        if (username === authData.email) {
          if (password === authData.password) {
            return done(null, authData, {
              message: "Welcome."
            });
          } else {
            return done(null, false, {
              message: "Incorrect password."
            });
          }
        } else {
          return done(null, false, {
            message: "Incorrect username."
          });
        }
      }
    )
  );

  return passport;
};
