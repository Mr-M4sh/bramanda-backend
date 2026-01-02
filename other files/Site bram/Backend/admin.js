// routes/admin.js - Admin routes for viewing customers and orders
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authenticate, isAdmin } = require('../middleware/auth');

// Protect all admin routes
router.use(authenticate, isAdmin);

// GET DASHBOARD STATS
router.get('/dashboard', async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ isAdmin: false });
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      stats: {
        totalCustomers,
        totalOrders,
        totalProducts,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingOrders
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching dashboard stats', 
      error: error.message 
    });
  }
});

// GET ALL CUSTOMERS
router.get('/customers', async (req, res) => {
  try {
    const customers = await User.find({ isAdmin: false })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: customers.length,
      customers
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching customers', 
      error: error.message 
    });
  }
});

// GET SINGLE CUSTOMER
router.get('/customers/:id', async (req, res) => {
  try {
    const customer = await User.findById(req.params.id).select('-password');
    
    if (!customer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Customer not found' 
      });
    }

    // Get customer's orders
    const orders = await Order.find({ user: customer._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      customer,
      orders
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching customer', 
      error: error.message 
    });
  }
});

// GET ALL ORDERS
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching orders', 
      error: error.message 
    });
  }
});

// UPDATE ORDER STATUS
router.put('/orders/:id', async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    res.json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating order', 
      error: error.message 
    });
  }
});

// DELETE ORDER
router.delete('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting order', 
      error: error.message 
    });
  }
});

module.exports = router;