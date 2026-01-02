# BRAMANDA MySQL Setup - Step-by-Step Checklist

## Pre-Upload Preparation (5 minutes)

- [ ] Log in to InfinityFree Control Panel
- [ ] Go to MySQL Databases section
- [ ] Create new database (name it `bramanda` or similar)
- [ ] Note the full database name: `if0_40589405_xxxxx`
- [ ] Have your InfinityFree password ready (same as account login)

---

## Step 1: Update Configuration Files (5 minutes)

### File 1: `backend/config.php`

**Find these lines:**

```php
$password = "XXXXX_REPLACE_WITH_YOUR_PASSWORD_XXXXX";
$dbname = "if0_40589405_bramanda";
```

**Replace with:**

```php
$password = "YOUR_ACTUAL_INFINITYFREE_PASSWORD";
$dbname = "if0_40589405_xxxxx"; // Your actual database name
```

**Example:**

```php
$password = "mySecurePass123";
$dbname = "if0_40589405_bramanda_shop";
```

### File 2: `js/config.js`

**Find this line:**

```javascript
backendUrl: 'https://yourdomain.freeinfohst.com/backend',
```

**Replace with your actual domain:**

```javascript
backendUrl: 'https://bramanda.freeinfohst.com/backend',
```

**Example formats:**

```javascript
// InfinityFree subdomain
backendUrl: 'https://bramanda.freeinfohst.com/backend',

// OR custom domain
backendUrl: 'https://www.yourdomain.com/backend',

// OR top-level
backendUrl: 'https://yourdomain.com/backend',
```

---

## Step 2: Upload Files via FTP (10 minutes)

### Download FileZilla (if needed)

- Get from: https://filezilla-project.org/

### FTP Login Details (from InfinityFree)

- **Host:** Your InfinityFree domain (e.g., `bramanda.freeinfohst.com`)
- **Username:** Your FTP username (from InfinityFree)
- **Password:** Your FTP password (from InfinityFree)
- **Port:** 21

### Upload These Files:

**Backend Folder** (`/public_html/backend/`):

- [ ] `backend/config.php` (UPDATED)
- [ ] `backend/setup_database.php`
- [ ] `backend/orders.php`
- [ ] `backend/products.php`

**JavaScript Folder** (`/public_html/js/`):

- [ ] `js/config.js` (NEW)
- [ ] `js/main.js` (UPDATED - replace old one)

**HTML Folder** (`/public_html/html/`):

- [ ] `html/index.html` (UPDATED - replace old one)
- [ ] `html/admin.html` (NEW)

### Final FTP Structure:

```
public_html/ ← This is your root
├── backend/
│   ├── config.php          ✓
│   ├── setup_database.php  ✓
│   ├── orders.php          ✓
│   └── products.php        ✓
├── js/
│   ├── config.js           ✓
│   └── main.js             ✓
├── html/
│   ├── index.html          ✓
│   └── admin.html          ✓
└── ... other files
```

---

## Step 3: Initialize Database (2 minutes)

### Visit this URL in your browser:

```
https://yourdomain.freeinfohst.com/backend/setup_database.php
```

Replace `yourdomain.freeinfohst.com` with your actual domain.

### Expected Response:

You should see JSON:

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

**If you see errors:**

- [ ] Check `config.php` password is correct
- [ ] Check database name is exactly right
- [ ] Wait 5 minutes and try again
- [ ] Check InfinityFree shows database as "Active"

---

## Step 4: Verify Admin Dashboard (2 minutes)

### Visit:

```
https://yourdomain.freeinfohst.com/html/admin.html
```

### What you should see:

- [ ] "✓ Connected to Backend" (green box)
- [ ] List of 4 default products in table
- [ ] "No orders yet" or list of orders (if you tested)

**If connection fails:**

- [ ] Check domain name in `config.js` is exactly correct
- [ ] Make sure backend URL in admin.html matches
- [ ] Check PHP files exist in `/backend/` folder via FTP
- [ ] Wait for DNS propagation (5-15 minutes after upload)

---

## Step 5: Test Order Submission (5 minutes)

### On Your Website:

1. [ ] Go to: `https://yourdomain.freeinfohst.com/html/index.html`
2. [ ] Add a product to cart
3. [ ] Click cart icon
4. [ ] Click "Proceed to Checkout"
5. [ ] Fill in test order:
   - Name: Test User
   - Email: test@example.com
   - Phone: 5550000
   - Address: 123 Test Street
   - City: Test City
   - State: TS
   - ZIP: 12345
   - Payment: Credit Card
6. [ ] Click "CONFIRM ORDER"

### Expected Results:

**In Browser:**

- You should see notification: `✓ Order confirmed! ID: 1`

**In Admin Dashboard:**

- Refresh the page at: `/html/admin.html`
- You should see your test order appear in the table

**Direct API Test:**

- Visit: `https://yourdomain.freeinfohst.com/backend/orders.php?action=get_orders`
- You should see JSON with your order

---

## Step 6: Verify in Database

### Check Orders via API:

```
https://yourdomain.freeinfohst.com/backend/orders.php?action=get_orders
```

Should show:

```json
{
  "success": true,
  "orders": [
    {
      "id": 1,
      "customer_name": "Test User",
      "customer_email": "test@example.com",
      "total_amount": "699.00",
      "order_status": "pending",
      "created_at": "2025-12-04 12:00:00"
    }
  ]
}
```

### Check Products:

```
https://yourdomain.freeinfohst.com/backend/products.php?action=get_products
```

Should show:

```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "product_code": "p1",
      "product_name": "ELFBAR 5000",
      "price": "699.00",
      "tagline": "RISE FROM ASHES"
    },
    ... 3 more products
  ]
}
```

---

## Step 7: Debug Console Check

### On Your Website:

1. [ ] Open browser (Chrome, Firefox, Edge)
2. [ ] Press `F12` to open Developer Tools
3. [ ] Go to **Console** tab
4. [ ] Look for messages starting with `[BRAMANDA]`
5. [ ] Should see something like:
   ```
   [BRAMANDA] Submitting order to: https://yourdomain.freeinfohst.com/backend/orders.php?action=submit_order
   [BRAMANDA] ✓ Order submitted to database {"order_id": 1}
   ```

**If you see errors:**

- [ ] Check console for "Cannot find X" or "404"
- [ ] Note the error message
- [ ] Check that URL matches your actual domain

---

## Final Checklist - All Done! ✓

- [ ] Config files updated with credentials
- [ ] All backend PHP files uploaded
- [ ] All JavaScript files uploaded
- [ ] `admin.html` uploaded
- [ ] Database initialized (setup_database.php returned ✓)
- [ ] Admin dashboard shows "Connected"
- [ ] Test order submitted successfully
- [ ] Order appears in orders API
- [ ] Products appear in products API
- [ ] Browser console shows [BRAMANDA] messages
- [ ] No errors in console

---

## Troubleshooting Quick Links

**Connection Not Working?**

1. Check domain in `config.js` is spelled exactly right
2. Check PHP files exist in `/backend/` folder
3. Visit `/backend/products.php?action=get_products` directly
4. Check browser console (F12) for error messages

**Database Errors?**

1. Run `setup_database.php` again
2. Check password in `config.php` is correct
3. Check database name is exactly right (e.g., `if0_40589405_bramanda`)
4. Wait 5-10 minutes after creating database

**Orders Not Saving?**

1. Check admin dashboard for connection status
2. Check browser console (F12) for errors
3. Check backend URL in `config.js` is correct
4. Try submitting test order again

---

## Support Files

Keep these for reference:

- `MYSQL_SETUP_GUIDE.md` - Full detailed guide
- `QUICK_CONNECT_GUIDE.md` - Quick reference
- `IMPLEMENTATION_SUMMARY.md` - Technical overview

---

**Next Steps After Success:**

1. Test with real orders
2. Monitor via admin.html regularly
3. Add email notifications (optional)
4. Create customer login (optional)
5. Build inventory management (optional)

---

**Estimated Time to Complete:** 30-45 minutes
**Difficulty Level:** Intermediate
**Support:** Check guides or InfinityFree docs

🎉 **You're all set! Your BRAMANDA database is live!**
