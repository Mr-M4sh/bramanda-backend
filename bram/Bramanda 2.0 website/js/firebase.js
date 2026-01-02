// Firebase Configuration Setup Guide
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/**
 * Saves a new order to the Firestore database.
 * @param {object} orderDetails - The data collected from the order form.
 * @returns {Promise<void>}
 */
function saveOrderToFirebase(orderDetails) {
    const orderData = {
        ...orderDetails,
        status: "pending", // Default status
        timestamp: firebase.firestore.FieldValue.serverTimestamp() // Firestore timestamp
    };

    return db.collection("orders").add(orderData);
}