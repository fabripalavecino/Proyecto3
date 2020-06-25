const User = (sequelize, type) => {
  return sequelize.define("user", {
    id: { type: type.INTEGER, primaryKey: true, autoIncrement: true },
    user_name: { type: type.STRING },
    full_name: { type: type.STRING },
    mail: { type: type.STRING },
    password: { type: type.STRING },
    address: { type: type.STRING },
    phone: { type: type.STRING },
    is_Admin: { type: type.TINYINT },
  });
};
module.exports = User;
