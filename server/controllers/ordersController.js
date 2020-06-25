const { Order } = require("../config/database");
const { Product } = require("../config/database");
const { product_order } = require("../config/database");

//CRUD order

const createOrder = async (req, res) => {
  try {
    const { state, total, payment_method, date_time, user_id } = req.body;
    const order = await Order.create({
      state,
      total,
      payment_method,
      date_time,
      user_id,
    });
    req.body.products.forEach(async (item) => {
      const product = await Product.findByPk(item.id);
      if (!product) {
        return res.status(400);
      }

      const po = {
        orderId: order.id,
        productId: item.id,
        quantity: item.qty,
      };
      await product_order.create(po);
    });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).send({ status: "ERROR", message: error.message });
  }
};

const getsOrders = async (req, res) => {
  try {
    const allOrders = await Order.findAll({
      include: [{
        model: Product,
        as: 'products',
        required: false,
        attributes: ['id', 'product_name'],
        through: {
          model: product_order,
          as: 'productOrders',
          attributes: ['quantity'],
        }
      }]
    });
    res.status(200).json(allOrders);
  } catch (error) {
    res.status(500).send({ status: "ERROR", message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await Order.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(req.body);
  } catch (error) {
    res.status(500).send({ status: "ERROR", message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.destroy({ where: { id: req.params.id } });
    res.status(200).send({ message: `Order n° ${req.params.id} deleted` });
  } catch (error) {
    res.status(500).send({ status: "ERROR", message: error.message });
  }
};

module.exports = { createOrder, getsOrders, updateOrder, deleteOrder };
