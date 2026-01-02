# BRAMANDA 2.0 - Backend Setup Guide

## Overview

This guide walks you through setting up the Google Sheets backend integration for order processing. Orders will be automatically recorded in Google Sheets and confirmation emails sent to customers.

---

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"+ New"** to create a new spreadsheet
3. Name it: `BRAMANDA Orders`
4. Rename the first sheet tab to `Orders`
5. Add these column headers in the first row:
   - A1: `Timestamp`
   - B1: `Name`
   - C1: `Email`
   - D1: `Phone`
   - E1: `Address`
   - F1: `City`
   - G1: `State`
   - H1: `ZIP`
   - I1: `Payment Method`
   - J1: `Items Ordered`
   - K1: `Total Amount`
   - L1: `Status`

---

## Step 2: Create a Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click **"New project"** (or **"+ New"**)
3. In the editor window, **select all code** and **delete it**
4. Copy the entire code from `js/google-apps-script.gs` in your project folder
5. Paste it into the Apps Script editor
6. Click **"Save"** (Ctrl+S)
7. When prompted, name the project: `BRAMANDA Order Backend`

---

## Step 3: Link Sheet to Apps Script

1. In the Apps Script editor, go to **Project Settings** (gear icon)
2. Copy the **Script ID**
3. Back in the code editor, add this to your first function:

```javascript
const SHEET_ID = "YOUR_SHEET_ID_HERE"; // Get from Google Sheet URL: /spreadsheets/d/SHEET_ID/

// Add this line after the "function doPost(e) {" line:
const ss = SpreadsheetApp.openById(SHEET_ID);
```

**To get your Sheet ID:**

- Open your Google Sheet
- Look at the URL: `https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i/edit`
- The ID is the long string: `1a2b3c4d5e6f7g8h9i`

---

## Step 4: Deploy as Web App

1. In Apps Script, click **"Deploy"** (top right)
2. Click **"New deployment"**
3. Click the **Type selector** (gear icon) and choose **"Web app"**
4. Fill in the deployment details:
   - **Description**: BRAMANDA Order System
   - **Execute as**: Choose your email account
   - **Who has access**: `Anyone`
5. Click **"Deploy"**
6. Copy the **Deployment URL** that appears

---

## Step 5: Update Your Website Code

1. Open `js/main.js` in your project
2. Find the line that says:
   ```javascript
   const scriptUrl =
     "https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercontent";
   ```
3. Replace `YOUR_SCRIPT_ID` with the **Deployment ID** from your deployment URL:
   - Example URL: `https://script.google.com/macros/s/AKfycby1X2a3b4c5d6e7f8g/usercontent`
   - Extract: `AKfycby1X2a3b4c5d6e7f8g`
4. Save the file

---

## Step 6: Test the Integration

1. Go to your website
2. Add a product to the cart
3. Click the cart icon (🛒)
4. Click **"Proceed to Checkout"**
5. Fill out the form:
   - Name: Test Customer
   - Email: your.email@gmail.com
   - Phone: 555-0000
   - Address: 123 Test St
   - City: Test City
   - State: TC
   - ZIP: 12345
   - Payment: Credit Card
6. Click **"Place Order"**
7. You should see a confirmation notification

---

## Step 7: Verify in Google Sheets

1. Open your `BRAMANDA Orders` Google Sheet
2. You should see a new row with your test order
3. Check your email (gmail address used above) for the confirmation email

---

## Troubleshooting

### "Deployment ID not working"

- Go back to Apps Script
- Click **"Deploy"** and copy the correct **Deployment ID**
- Make sure it's the ID, not the full URL

### "Email not being sent"

- Check that the email address in the form is valid
- The sender will be from your Gmail account
- Make sure Gmail can send emails (may need to enable app access)

### "Orders not appearing in Sheet"

- Check the sheet name is exactly `Orders`
- Verify column headers match exactly
- Check the Apps Script logs: **View > Logs**

### "CORS or permission errors"

- Make sure deployment is set to **"Who has access: Anyone"**
- Use **no-cors** mode in fetch (already done in your code)

---

## Tips

### Customize the Confirmation Email

Open `google-apps-script.gs` and find the `sendOrderConfirmation()` function. You can edit:

- Email subject line
- HTML design and colors
- Message content

### Track Orders

You can view all orders in the Google Sheet and add notes, mark as "Shipped", etc.

### Backup Orders

Orders are automatically saved to:

- Google Sheets (primary)
- Browser's localStorage (backup)

You can access localStorage orders by opening browser DevTools and running:

```javascript
JSON.parse(localStorage.getItem("bramanda_orders"));
```

---

## Integration Complete! 🚀

Your BRAMANDA website now has a fully functional order system. Customers can:

- ✓ Add products to cart
- ✓ Fill checkout form
- ✓ Submit orders
- ✓ Receive confirmation emails
- ✓ Orders recorded in Google Sheets

---

## Advanced: Automate Emails to YOU

Want to get an email every time someone orders?

1. Open your Google Sheet
2. Go to **Tools > Notification rules**
3. Set up email alerts when the sheet is modified

---

## Questions?

Check the browser console (F12 > Console) for any error messages. They often indicate what's wrong.

---

**Version:** 1.0  
**Last Updated:** 2024  
**Framework:** Vanilla JavaScript + Google Apps Script + Google Sheets
