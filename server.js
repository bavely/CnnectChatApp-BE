const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const routes = require("./routes/index");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(cookieParser());
app.use(cors(
  {
    origin: ["http://localhost:3000"],
    credentials: true,
  }
));
app.options("*", cors());
app.use(express.json());
app.use("/", routes);

app.get("/", (req, res) => {
  res.send("Hello Connect API!");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

module.exports = app;
