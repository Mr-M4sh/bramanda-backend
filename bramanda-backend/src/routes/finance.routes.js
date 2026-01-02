const router = require("express").Router();
const Finance = require("../models/Finance");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

/**
 * Get finance summary
 */
router.get("/", auth, async (req, res) => {
  const data = await Finance.findOne() || { investedMoney: 0, totalRevenue: 0 };
  res.json(data);
});

/**
 * Update invested money (superadmin only)
 */
router.put("/investment", auth, role(["superadmin"]), async (req, res) => {
  const { investedMoney } = req.body;
  const data = await Finance.findOneAndUpdate(
    {},
    { investedMoney },
    { upsert: true, new: true }
  );
  res.json(data);
});

module.exports = router;
