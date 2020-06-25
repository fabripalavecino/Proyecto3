module.exports = (sequelize, type) => {
  return sequelize.define("order", {
    id: { type: type.INTEGER, primaryKey: true, autoIncrement: true },
    state: { type: type.STRING },
    payment_method: { type: type.STRING },
    date_time: { type: type.STRING },
    user_id: { type: type.INTEGER },
  });
};
