module.exports = (sequelize, type) => {
    return sequelize.define("product_order", {
      id: { type: type.INTEGER, primaryKey: true, autoIncrement: true },
      productId: { type: type.INTEGER },
      orderId: { type: type.INTEGER },
      quantity: { type: type.STRING },   
    });
  };
  