# BRAMANDA 2.0 - MySQL Integration Guide

## Overview

Your BRAMANDA website now connects to a MySQL database (InfinityFree) instead of Google Sheets. This guide teaches you step-by-step how to set it up and test it.

---

## STEP 1: Create Your Database on InfinityFree

### Your Connection Details:

- **Hostname:** `sql100.infinityfree.com`
- **Username:** `if0_40589405`
- **Port:** `3306`
- **Database Name Pattern:** `if0_40589405_XXX` (you'll create this)

### To Create a Database:

1. Go to [InfinityFree Control Panel](https://www.infinityfree.com/)
2. Log in with your account
3. Click **MySQL Databases** in the left sidebar
4. Under "Create New Database", enter a name like: `bramanda` or `bramanda_shop`
5. Click **Create Database**
6. Your full database name will be something like: `if0_40589405_bramanda`

**Note:** InfinityFree auto-prefixes your account ID, so you cannot choose any name you want.

---

## STEP 2: Update the PHP Configuration File

Edit `backend/config.php` and replace with your actual database name and password:

```php
<?php
$servername = "sql100.infinityfree.com";
$username = "if0_40589405";
$password = "YOUR_ACTUAL_PASSWORD_HERE"; // Replace with your InfinityFree password
$dbname = "if0_40589405_bramanda"; // Replace with your actual database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => $conn->connect_error]));
}
$conn->set_charset("utf8");
?>
```

**Save this file securely!** This contains your database credentials.

---

## STEP 3: Upload Files to InfinityFree

### Files to Upload:

- `backend/config.php` — Database configuration
- `backend/setup_database.php` — Database table creator
- `backend/orders.php` — Order management API
- `backend/products.php` — Product management API
- `js/main.js` — Updated JavaScript (already done)

### How to Upload via FTP:

1. Download an FTP client: [FileZilla](https://filezilla-project.org/) (free)
2. Log in to FileZilla with InfinityFree FTP details:
   - **Host:** Your InfinityFree domain (e.g., `bramanda.freeinfohst.com`)
   - **Username:** Your InfinityFree FTP username
   - **Password:** Your InfinityFree FTP password
   - **Port:** `21`
3. Navigate to the `public_html` folder
4. Create a folder called `backend`
5. Upload all backend PHP files into `/public_html/backend/`

### Directory Structure After Upload:

```
public_html/
├── html/
│   ├── index.html
│   ├── shop.html
│   └── ...
├── css/
│   └── style.css
├── js/
│   └── main.js
├── backend/
│   ├── config.php
│   ├── setup_database.php
│   ├── orders.php
│   └── products.php
└── img/
    └── ...
```

---

## STEP 4: Initialize Database Tables

Once files are uploaded:

1. Open your browser and go to:

   ```
   https://yourdomainname.freeinfohst.com/backend/setup_database.php
   ```

2. You should see a JSON response like:

   ```json
   {
     "success": true,
     "messages": [
       "✓ Orders table created/verified",
       "✓ Products table created/verified",
       "✓ Customers table created/verified",
       "✓ Default products inserted"
     ]
   }
   ```

3. **If you see errors:** Check your `config.php` credentials are correct.

---

## STEP 5: Update Your JavaScript Backend URL

In `js/main.js`, find the `sendToGoogleSheets` function and update:

```javascript
const backendUrl =
  "https://yourdomainname.freeinfohst.com/backend/orders.php?action=submit_order";
```

Replace `yourdomainname.freeinfohst.com` with your actual InfinityFree domain.

---

## STEP 6: Test the Integration

### Test Submission:

1. Go to your website: `https://yourdomainname.freeinfohst.com/html/index.html`
2. Add a product to cart
3. Click cart → Proceed to Checkout
4. Fill in the form and submit
5. Check browser console (F12 > Console) for confirmation message

### View Submitted Orders:

1. Go to:

   ```
   https://yourdomainname.freeinfohst.com/backend/orders.php?action=get_orders
   ```

2. You should see JSON with all orders:
   ```json
   {
     "success": true,
     "orders": [
       {
         "id": 1,
         "customer_name": "John Doe",
         "customer_email": "john@example.com",
         "total_amount": "2097.00",
         "order_status": "pending",
         "created_at": "2025-12-04 12:30:45"
       }
     ]
   }
   ```

---

## API Endpoints Reference

### Orders API

- **Submit Order:** `POST /backend/orders.php?action=submit_order`
- **Get All Orders:** `GET /backend/orders.php?action=get_orders`
- **Get Order by ID:** `GET /backend/orders.php?action=get_order&order_id=1`
- **Get Customer Orders:** `GET /backend/orders.php?action=get_customer_orders&email=john@example.com`

### Products API

- **Get All Products:** `GET /backend/products.php?action=get_products`
- **Get Product by ID:** `GET /backend/products.php?action=get_product&product_id=1`
- **Search Products:** `GET /backend/products.php?action=search_products&query=vape`
- **Add Product:** `POST /backend/products.php?action=add_product` (with JSON body)

---

## Database Schema

### Orders Table

```
id (Primary Key)
customer_name
customer_email
customer_phone
shipping_address
city, state, zip_code
payment_method
products (JSON)
total_amount
order_status (pending/processing/shipped/delivered)
created_at
updated_at
```

### Products Table

```
id (Primary Key)
product_code (unique)
product_name
price
description
image_url
tagline
stock_quantity
created_at
updated_at
```

### Customers Table

```
id (Primary Key)
email (unique)
name
phone
address, city, state, zip_code
total_orders
total_spent
created_at
updated_at
```

---

## Troubleshooting

### Error: "Database connection failed"

- Check `config.php` password is correct
- Check database name is correct
- Wait 5 minutes after creating the database

### Error: "Table doesn't exist"

- Run `setup_database.php` again to create tables
- Check the response shows "✓" for all messages

### Orders not appearing in database

- Check browser console for errors (F12)
- Verify backend URL in `main.js` is correct
- Test API directly: visit `/backend/orders.php?action=get_orders`

### CORS or "Access Denied" errors

- Headers in PHP files allow cross-origin requests
- If issues persist, contact InfinityFree support

---

## Security Notes

⚠️ **Important:**

- Never commit `config.php` to public GitHub with real credentials
- Use environment variables for production (ask for help if needed)
- SQL injection protection is built-in with `real_escape_string()` and prepared statements
- Always validate user input on backend

---

## Next Steps

After setup is complete, you can:

1. **View Orders Dashboard** - Create an admin page to view all orders
2. **Update Order Status** - Mark orders as "processing", "shipped", etc.
3. **Customer Analytics** - Track repeat customers, total spent
4. **Email Notifications** - Send automatic emails when orders arrive
5. **Inventory Management** - Track stock quantities

---

## Quick Reference Commands

Test database connection:

```bash
# Via terminal (if MySQL CLI installed):
mysql -h sql100.infinityfree.com -u if0_40589405 -p if0_40589405_bramanda
```

Check InfinityFree MySQL Status:

1. Log in to InfinityFree Control Panel
2. Click **MySQL Databases**
3. Your database should show "Active" status

---

## Support

If you encounter issues:

1. Check InfinityFree status: https://www.infinityfree.com/status
2. Review error messages in browser console (F12)
3. Test API endpoints directly in browser
4. Check FTP file permissions (should be 644 for PHP files)

Good luck! Your BRAMANDA database is now live! 🚀
