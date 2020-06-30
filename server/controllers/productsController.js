const { Product } = require("../config/database");
// CRUD products
const createProduct = async (req, res) => {
  try {
    const { product_name, description, price, image } = req.body;
    const product = await Product.create({
      product_name,
      description,
      price,
      image,
    });
    res.status(200).send({ message: `Product created` , data: product });
  } catch (error) {
    res.status(500).send({ data: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send({ status: "ERROR", data: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id } });
    if (!product) {
      throw {
        code: 404,
        message: `Not found product ${id}`,
      };
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(500).send({ status: "ERROR", data: error.message });
  }
};
const updateProduct = async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const productUpdated = await Product.findByPk(req.params.id);
      res
        .status(200)
        .send({
          message: `product ${req.params.id} updated`,
          data: productUpdated,
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "ERROR", data: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      throw {
        code: 404,
        message: `Not found product ${req.params.id}`,
      };
    }
    await Product.destroy({ where: { id: req.params.id } });
    res
      .status(200)
      .send({ message: `Product ${req.params.id} deleted`, data: product });
  } catch (error) {
    res.status(500).send({ status: "ERROR", data: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
