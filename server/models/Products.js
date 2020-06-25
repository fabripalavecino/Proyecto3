module.exports = (sequelize, type) => {
  return sequelize.define("product", {
    id: { type: type.INTEGER, primaryKey: true, autoIncrement: true },
    product_name: { type: type.STRING },
    description: { type: type.STRING },
    price: { type: type.INTEGER },
    image: { type: type.STRING },
  });
};
