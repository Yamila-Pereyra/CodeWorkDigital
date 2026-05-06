var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

require("dotenv").config();
var session = require("express-session");

var indexRouter = require("./routes/index");
var loginRouter = require("./routes/admin/login");
var adminRouter = require("./routes/admin/novedades");
var apiRouter = require("./routes/api");

var app = express();

function isApiRequest(req) {
  return req.originalUrl.startsWith("/api/");
}

function secured(req, res, next) {
  if (req.session && req.session.id_usuario) {
    next();
    return;
  }

  res.redirect("/admin/login");
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "Cursos2026",
    cookie: { maxAge: null },
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/", indexRouter);
app.use("/admin/login", loginRouter);
app.use("/admin/novedades", secured, adminRouter);
app.use("/api", cors(), apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404, "Not found"));
});

// error handler
app.use(function (err, req, res, next) {
  var status = err.status || 500;
  var isDevelopment = req.app.get("env") === "development";
  var publicMessage =
    status >= 500 && !isDevelopment ? "Internal server error" : err.message;

  if (isApiRequest(req)) {
    res.status(status).json({
      error: true,
      message: publicMessage,
    });
    return;
  }

  res.locals.message = publicMessage;
  res.locals.errorDetails = isDevelopment ? err.stack : null;

  res.status(status);
  res.render("error");
});

module.exports = app;
