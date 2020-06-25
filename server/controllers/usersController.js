const { User } = require("../config/database");
const brcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const expiresIn = 60 * 100;

//CRUD users

const createUser = async (req, res) => {
  try {
    const {
      user_name,
      full_name,
      mail,
      password,
      address,
      phone,
      is_Admin,
    } = req.body;

    const hash = await brcypt.hash(password, 15);

    const user = await User.create({
      user_name,
      full_name,
      mail,
      password: hash,
      address,
      phone,
      is_Admin,
    });
    res
      .status(200)
      .send({ status: "Ok", message: `User Created ${user.user_name}` });
  } catch (error) {
    if (error.code == "ER_DUP_ENTRY" || error.errno == 1062) {
      res.status(400).send({
        status: "Duplicated entry/value",
        message: error.sqlMessage,
      });
      return;
    }

    res.status(500).send({ status: "ERROR", message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { user_name, password } = req.body;
    const user = await User.findOne({ where: { user_name: user_name } });
    if (user) {
      const isOk = await brcypt.compare(password, user.password);
      if (isOk) {
        const token = jwt.sign(
          { user: user.user_name, role: user.is_Admin },
          process.env.JWT_SECRET,
          {
            expiresIn,
          }
        );
        res.send({ status: "Ok", data: token, expiresIn });
      } else {
        res.status(403).send({ status: "INVALID_PASSWORD", message: "" });
      }
    } else {
      res.status(401).send({ status: "USER_NOT_FOUND", message: "" });
    }
  } catch (error) {
    res.status(500).send({ status: "ERROR", message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params.id;
    await User.destroy({ where: { id: userId } });
    res.status(200).send({ message: "Ok, user deleted" });
  } catch (error) {
    res.status(500).send({ status: "ERROR", data: error.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const { user_name, full_name, mail, address, phone } = req.body;
    const id = req.params.id;
    await User.update(
      {
        user_name,
        full_name,
        mail,
        address,
        phone,
      },
      { where: { id: id } }
    );
    res
      .status(200)
      .send({ message: `user ${user_name} updated`, data: req.body });
  } catch (error) {
    res
      .status(500)
      .send({ status: "ERROR User Not Updated", data: error.message });
  }
};
const getUsers = async (req, res) => {
  try {
    const users = await User.findall();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send({ status: "ERROR", data: error.message });
  }
};
const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ where: { id: id } });
    if (user === null) {
      throw {
        code: 404,
        message: `Not found user ${id}`,
      };
    } else {
      res.send({ status: `ok,this is the User ${id}`, data: user });
    }
  } catch (error) {
    res.status(500).send({ status: "ERROR", data: error.message });
  }
};

module.exports = {
  createUser,
  login,
  deleteUser,
  updateUser,
  getUsers,
  getUserById,
};
