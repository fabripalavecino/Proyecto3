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
    res.status(200).send({ info: "ok, product created", data: product });
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
    let id = req.params.id;
    const product = await Product.findOne({ where: { id: id } });
    if (product === null) {
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
    const { product_name, description, price, image } = req.body;
    const id = req.params.id;
    await Product.update(
      {
        product_name,
        description,
        price,
        image,
      },
      { where: { id: id } }
    );
    res.status(200).send({ message: `product ${id} updated`, data: req.body });
  } catch (error) {
    res.status(500).send({ status: "ERROR", data: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Product.destroy({ where: { id: id } });
    if (deleted) {
      return res.status(200).send({ message: "Product Deleted" });
    }
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
