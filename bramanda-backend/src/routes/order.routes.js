const router = require("express").Router();
const Order = require("../models/Order");
const Finance = require("../models/Finance");
const auth = require("../middleware/auth");
const { getIO } = require("../config/socket");

/**
 * Create order
 */
router.post("/", auth, async (req, res) => {
  const order = await Order.create(req.body);

  const io = getIO();
  io.emit("orders:update", order);

  res.json(order);
});

/**
 * Get all orders
 */
router.get("/", auth, async (req, res) => {
  res.json(await Order.find().sort({ createdAt: -1 }));
});

/**
 * Mark order as done → add revenue
 */
router.put("/:id/done", auth, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.sendStatus(404);

  if (order.status !== "Done") {
    order.status = "Done";
    await order.save();

    await Finance.findOneAndUpdate(
      {},
      { $inc: { totalRevenue: order.amount } },
      { upsert: true }
    );

    const io = getIO();

