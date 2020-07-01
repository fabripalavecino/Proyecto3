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
        quantity: item.quantity,
      };
      await product_order.create(po);
    });
    res.status(200).send({ status: `Order created`, data: order });
  } catch (error) {
    res.status(500).send({ status: "ERROR", message: error.message });
  }
};

const getsOrders = async (req, res) => {
  try {
    const allOrders = await Order.findAll({
      include: [
        {
          model: Product,
          as: "products",
          required: false,
          attributes: ["id", "product_name"],
          through: {
            model: product_order,
            as: "productOrders",
            attributes: ["quantity"],
          },
        },
      ],
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
    if (order) {
      const orderUpdated = await Order.findByPk(req.params.id);
      res.status(200).send({
        message: `order ${req.params.id} updated`,
        data: orderUpdated,
      });
    }
  } catch (error) {
    res.status(500).send({ status: "ERROR", message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      throw {
        code: 404,
        message: `Not found Order ${req.params.id}`,
      };
    }
    await Order.destroy({ where: { id: req.params.id } });
    res
      .status(200)
      .send({ message: `Order n° ${req.params.id} deleted`, data: order });
  } catch (error) {
    res.status(500).send({ status: "ERROR", message: error.message });
  }
};

module.exports = { createOrder, getsOrders, updateOrder, deleteOrder };
