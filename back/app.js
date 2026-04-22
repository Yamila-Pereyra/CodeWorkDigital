var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var crypto = require("crypto");

require("dotenv").config({ path: path.join(__dirname, ".env") });
var session = require("express-session");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var loginRouter = require("./routes/admin/login");
var adminRouter = require("./routes/admin/novedades");
var apiRouter = require("./routes/api");

var app = express();
var isProduction = process.env.NODE_ENV === "production";
var generatedDevelopmentSessionSecret = crypto.randomBytes(32).toString("hex");
var sessionSecret = process.env.SESSION_SECRET || generatedDevelopmentSessionSecret;
var sessionCookieName = process.env.SESSION_COOKIE_NAME || "codework.sid";
var sessionMaxAge = Number(process.env.SESSION_MAX_AGE_MS || 1000 * 60 * 60 * 8);
var allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!process.env.SESSION_SECRET && isProduction) {
  throw new Error("SESSION_SECRET is required in production");
}

if (!process.env.SESSION_SECRET && !isProduction) {
  console.warn(
    "SESSION_SECRET is not set. Using a generated in-memory secret for this process."
  );
}

if (Number.isNaN(sessionMaxAge) || sessionMaxAge <= 0) {
  throw new Error("SESSION_MAX_AGE_MS must be a positive number");
}

if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

function isApiRequest(req) {
  return req.originalUrl.startsWith("/api/");
}

function corsOriginValidator(origin, callback) {
  if (!origin) {
    callback(null, true);
    return;
  }

  if (!allowedOrigins.length && !isProduction) {
    var defaultDevOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];

    if (defaultDevOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
  }

  if (allowedOrigins.includes(origin)) {
    callback(null, true);
    return;
  }

  callback(createError(403, "Origin not allowed by CORS"));
}

var apiCors = cors({
  origin: corsOriginValidator,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  optionsSuccessStatus: 204,
});

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
    name: sessionCookieName,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    unset: "destroy",
    proxy: process.env.TRUST_PROXY === "true",
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      maxAge: sessionMaxAge,
    },
  })
);

if (isProduction) {
  console.warn(
    "Using express-session MemoryStore. It is acceptable for this stabilization step, but not ideal for multi-instance production."
  );
}

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/admin/login", loginRouter);
app.use("/admin/novedades", secured, adminRouter);
app.use("/api", apiCors, apiRouter);

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
