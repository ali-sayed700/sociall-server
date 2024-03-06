// const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/User.Model");
const ApiError = require("../utilities/ApiError");
const createToken = require("../utilities/CreateToken");

exports.Register = asyncHandler(async (req, res) => {
  const { username, password, firstname, lastname } = req.body;
  const user = await UserModel.create({
    username,
    password,
    firstname,
    lastname,
  });
  // 2- Generate token
  const token = createToken(user._id);
  res.status(201).json({ status: "success", data: user, token });
});

// @desc    Login
// @route   GET /api/v1/auth/login
// @access  Public
exports.Login = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body (validation)
  // 2) check if user exist & check if password is correct
  const user = await UserModel.findOne({ username: req.body.username }).populate({ path: 'following', select: '-password' })

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  // 3) generate token
  // const token = createToken(user._id);

  // 2- Generate token
  const token = createToken(user._id);

  // Delete password from response
  delete user._doc.password;
  // 4) send response to client side

  res.status(200).json({ status: "success login", data: user, token });
});

// @desc   make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not login, Please login to get access this route",
        401
      )
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) Check if user exists
  const currentUser = await UserModel.findById(decoded.userId).populate("following");
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401
      )
    );
  }

  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password. please login again..",
          401
        )
      );
    }
  }

  req.user = currentUser;
  
  next();
});

// @desc    Authorization (User Permissions)
// ["admin", "manager"]
// exports.allowedTo = (isAdmin) =>
//   asyncHandler(async (req, res, next) => {
//     // 1) access roles
//     // 2) access registered user (req.user.role)
//     if (isAdmin === true) {
//       return next(
//         new ApiError("You are not allowed to access this route", 403)
//       );
//     }
//     next();
//   });
