var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// Basic Imports
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");

// Passport Imports
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");

// Connect to database
async function main() {
  const mongoURI =
    "mongodb+srv://dementia1349:test@cluster0.zw0djkv.mongodb.net/odin_book?retryWrites=true&w=majority";
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB Atlas!");
}
main().catch((err) => console.log(err));

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Define passport login strategy
passport.use(
  "login",
  {
    usernameFiled: "email",
    passwordFiled: "password",
  },
  new LocalStrategy(async (email, password, done) => {
    try {
      // Verify email and password
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: "Invalid email" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Verify token - passport
passport.use(
  new JWTstrategy(
    {
      secretOrKey: "acum",
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        const user = await User.findById(token.userId);

        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

app.use("/", indexRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
