// Prerequisites:
// 1. Install Node.js
// 2. Create a folder, run `npm init -y`
// 3. Install packages: `npm install express mongoose cors body-parser`

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allows your frontend to talk to this backend
app.use(bodyParser.json());

// MongoDB Connection
// Replace 'your_connection_string' with your actual MongoDB Atlas URL
// Example: 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority'
const MONGO_URI = 'mongodb://localhost:27017/manish_portfolio'; 

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.log('❌ MongoDB Connection Error:', err));

// Schema Definition
const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', ContactSchema);

// Routes
app.get('/', (req, res) => {
    res.send('Manish Portfolio Backend is Running');
});

// POST Route to receive form data
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newContact = new Contact({ name, email, message });
        await newContact.save();

        res.status(201).json({ message: 'Message saved successfully!' });
        console.log(`📩 New Message from ${name}: ${message}`);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});