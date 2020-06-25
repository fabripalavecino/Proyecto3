//Import Models
const ProductModel = require("../models/Products");
const OrderModel = require("../models/Orders");
const UserModel = require("../models/Users");
const Product_OrderModel = require("../models/product_order");
const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "mysql",
  define: {
    timestamps: false,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
//Instance Models
const Product = ProductModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);
const Order = OrderModel(sequelize, Sequelize);
const product_order = Product_OrderModel(sequelize, Sequelize);
//Associations
Order.belongsTo(User, { foreignKey: "user_id", sourceKey: "id" });
Product.belongsToMany(Order, { through: product_order });
Order.belongsToMany(Product, { through: product_order });

sequelize.sync();

module.exports = { sequelize, Sequelize, Product, User, Order, product_order };
