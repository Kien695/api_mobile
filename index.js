const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const database = require("./config/database");
database.connect();
const port = process.env.PORT;
app.use(cors());
app.use(cookieParser());
app.use(express.json());
const routerClient = require("./routes/index.js");
routerClient(app);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
