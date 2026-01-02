const router = require("express").Router();
const Inventory = require("../models/Inventory");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

/**
 * Add inventory (admin only)
 */
router.post("/", auth, role(["admin", "superadmin"]), async (req, res) => {
  res.json(await Inventory.create(req.body));
});

/**
 * Get inventory
 */
router.get("/", auth, async (req, res) => {
  res.json(await Inventory.find());
});

/**
 * Update inventory
 */
router.put("/:id", auth, role(["admin", "superadmin"]), async (req, res) => {
  res.json(
    await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true })
  );
});

module.exports = router;
