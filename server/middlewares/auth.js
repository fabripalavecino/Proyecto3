const jwt = require("jsonwebtoken");
const { User } = require("../config/database");

const isAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (token) {
      const data = jwt.verify(token, process.env.JWT_SECRET);
      console.log("jwt data",data);
      if (data.user !== req.body.user_name) {
        console.log(req.body.user_name);
        console.log("data.user",data.user);
        throw {
          code: 403,
          status: "ACCESS_DENIED",
          message: "Missing permission",
        };
      }
      req.sessionData = { user: data.user_name, role: data.role };
      next();
    } else {
      throw {
        code: 403,
        status: "ACCESS_DENIED",
        message: "Missing header token",
      };
    }
  } catch (error) {
    res
      .status(error.code || 500)
      .send({ status: error.status || "ERROR", message: error.message });
  }
};

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  // Username
  const user = await User.findOne({
    where: {
      user_name: req.body.user_name,
    },
  });
  if (user) {
    res.status(400).send({
      message: "Failed! Username is already in use!",
    });
    return;
  }
  // Email
  const user_email = await User.findOne({
    where: {
      mail: req.body.mail,
    },
  });
  if (user_email) {
    res.status(400).send({
      message: "Failed! Email is already in use!",
    });
    return;
  }

  next();
};

const isAdmin = (req, res, next) => {
  try {
    const { role } = req.sessionData;
    console.log("is Admin", role);
    //Admin = 1
    if (role !== 1) {
      throw {
        code: 403,
        status: "ACCESS_DENIED",
        message: "Invalid role",
      };
    }
    next();
  } catch (error) {
    res
      .status(error.code || 500)
      .send({ status: error.status || "ERROR", message: error.message });
  }
};

module.exports = { isAuth, checkDuplicateUsernameOrEmail, isAdmin };
