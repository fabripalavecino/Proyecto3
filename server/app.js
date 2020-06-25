//Import express

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./config/database");
const routes = require("./routes/index");
require("dotenv").config();

db.sequelize
  .authenticate()
  .then(() => console.log("DB Conectada"))
  .catch((error) => console.log(error));

//config express

const app = express();


//config Body Parser
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

//config cors
app.use(cors());

//config routes
app.use("/", routes());

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
