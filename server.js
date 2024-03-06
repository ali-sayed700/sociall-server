const express = require("express");
const cors = require("cors");
const path = require("path");
const compression = require("compression");

const app = express();
// #cors
// Enable other domain access to your app
app.options("*", cors());

app.use(cors());


// compress all responses
app.use(compression());

const morgan = require("morgan");

const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });

// Global error handling middleware for express
const ApiError = require("./utilities/ApiError");
const globalError = require("./middlewares/Error.MiddleWare");
// Connect with db
const dbConnection = require("./config/DataBase");
// routes
const AuthRoute = require("./routes/Auth.Routes");
const UserRoute = require("./routes/User.Routes");
const PostRoute = require("./routes/Post.Routes");
const FollowerRoute = require("./routes/Followers.Routes");
const ChatRoute = require("./routes/Chat.Routes");
const MessageRoute = require("./routes/Message.Routes");
const CommentRoute = require("./routes/Comment.Routes");
const TagsRoute = require("./routes/Tags.Routes");
const BlockRoute = require("./routes/Block.Routes");

app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.json({ limit: "30mb" }));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

dbConnection();

//  Mount Routes

app.use("/auth", AuthRoute);
app.use("/user", UserRoute);
app.use("/post", PostRoute);
app.use("/follow-people", FollowerRoute);
app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);
app.use("/comment", CommentRoute);
app.use("/tag", TagsRoute);
app.use("/block", BlockRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});

// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
