require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");

const connectDB = require("./config/db");
const { initSocket } = require("./config/socket");

const app = express();
const server = http.createServer(app);

connectDB();

app.use(cors());
app.use(express.json());

initSocket(server);

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/inventory", require("./routes/inventory.routes"));
app.use("/api/finance", require("./routes/finance.routes"));

app.get("/", (req, res) => {
  res.send("Bramanda API running");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
