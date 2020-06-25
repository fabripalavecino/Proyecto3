const express = require("express");
const router = express.Router();

// Controllers
const productsController = require("../controllers/productsController");
const usersController = require("../controllers/usersController");
const ordersController = require("../controllers/ordersController");

// Middlewares
const { isAuth, isAdmin, checkDuplicateUsernameOrEmail } = require("../middlewares/auth");

module.exports = () => {
    // products routes
  router.post("/api/v1/products",isAuth,isAdmin, productsController.createProduct);
  router.get("/api/v1/products/get-all", productsController.getProducts);
  router.get("/api/v1/products/:id", isAuth,productsController.getProductById);
  router.put("/api/v1/products/:id",isAuth,isAdmin, productsController.updateProduct);
  router.delete("/api/v1/products/:id",isAuth,isAdmin, productsController.deleteProduct);
  // users routes
  router.post("/api/v1/users", checkDuplicateUsernameOrEmail, usersController.createUser);
  router.post("/api/v1/users/login", usersController.login);
  router.get("/api/v1/users/get-all",isAuth, isAdmin, usersController.getUsers);
  router.get("/api/v1/users/:id", isAuth, usersController.getUserById);
  router.put("/api/v1/users/:id",isAuth ,checkDuplicateUsernameOrEmail,usersController.updateUser);
  router.delete("/api/v1/users/:id", isAuth, usersController.deleteUser);
  // orders routes
  router.post("/api/v1/orders", ordersController.createOrder);
  router.get("/api/v1/orders/get-all",isAuth,isAdmin, ordersController.getsOrders);
  router.put("/api/v1/orders/:id",isAuth,isAdmin, ordersController.updateOrder);
  router.delete("/api/v1/orders/:id",isAuth,isAdmin, ordersController.deleteOrder);

  return router;
};
