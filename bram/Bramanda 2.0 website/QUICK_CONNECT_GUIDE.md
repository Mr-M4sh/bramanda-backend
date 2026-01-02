# BRAMANDA - Quick Connection Guide After Uploading PHP Files

## Overview

Once your PHP backend files are uploaded to InfinityFree, follow these steps to connect them to your BRAMANDA website.

---

## STEP 1: Update config.js with Your Domain

After you upload the backend files via FTP, you need to tell your website where to find them.

### File: `js/config.js`

Find this line:

```javascript
backendUrl: 'https://yourdomain.freeinfohst.com/backend',
```

Replace with your actual InfinityFree domain:

```javascript
backendUrl: 'https://bramanda.freeinfohst.com/backend',
// or if you have a custom domain:
backendUrl: 'https://yourdomain.com/backend',
```

**Example Full URL:** If your domain is `bramanda.freeinfohst.com` and you uploaded PHP files to `/public_html/backend/`, then:

- Backend URL: `https://bramanda.freeinfohst.com/backend`
- Orders endpoint: `https://bramanda.freeinfohst.com/backend/orders.php?action=submit_order`
- Products endpoint: `https://bramanda.freeinfohst.com/backend/products.php?action=get_products`

---

## STEP 2: Enable MySQL Backend

In `js/config.js`, change this flag to `true`:

```javascript
features: {
    useMysqlBackend: true,  // ← Change to true
    useLocalStorageBackup: true,
    enableDebugLogging: true
}
```

---

## STEP 3: Test the Connection

### Method 1: Browser Console Test

1. Open your website in browser
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Paste this command and press Enter:

```javascript
fetch(
  "https://yourdomain.freeinfohst.com/backend/products.php?action=get_products"
)
  .then((r) => r.json())
  .then((d) => console.log("✓ Connected!", d))
  .catch((e) => console.error("✗ Connection failed:", e));
```

Expected output: `✓ Connected!` with product list

### Method 2: Direct URL Test

1. Visit: `https://yourdomain.freeinfohst.com/backend/products.php?action=get_products`
2. Should see JSON response with products

### Method 3: Test Order Submission

1. Go to your website
2. Add product to cart
3. Proceed to checkout
4. Fill form and submit
5. Check browser console (F12) for confirmation message
6. Visit: `https://yourdomain.freeinfohst.com/backend/orders.php?action=get_orders`
7. Should see your order in JSON response

---

## STEP 4: Upload Updated Files

After updating `config.js`, upload these files via FTP:

- `js/config.js` — NEW (upload to `/public_html/js/`)
- `js/main.js` — UPDATED (upload to `/public_html/js/`)
- `html/index.html` — UPDATED (upload to `/public_html/html/`)

Directory structure should be:

```
public_html/
├── backend/
│   ├── config.php
│   ├── setup_database.php
│   ├── orders.php
│   └── products.php
├── html/
│   └── index.html
├── js/
│   ├── config.js      ← NEW
│   ├── main.js        ← UPDATED
│   └── ...other files
├── css/
│   └── style.css
└── img/
    └── ...
```

---

## Troubleshooting

### "Connection Error" Notifications

**Cause:** Website can't reach backend files

**Solutions:**

1. Check domain name in `config.js` is exactly correct (case-sensitive)
2. Verify PHP files exist in `/backend/` folder via FTP
3. Check file permissions are 644 (read-only for PHP files)
4. Wait 5-10 minutes after upload for changes to propagate
5. Try visiting backend URL directly in browser

### "Database Connection Failed"

**Cause:** `config.php` has wrong credentials

**Solutions:**

1. Double-check password in `config.php`
2. Verify database name is correct (e.g., `if0_40589405_bramanda`)
3. Confirm hostname is `sql100.infinityfree.com`
4. If database doesn't exist yet, create it in InfinityFree Control Panel

### No Orders Appearing in Database

**Cause:** Backend enabled but not set up

**Steps:**

1. First run: `https://yourdomain.freeinfohst.com/backend/setup_database.php`
2. Should see JSON with "✓" messages
3. Then test order submission

### CORS or Cross-Origin Errors

The PHP files have CORS headers set up. If still seeing errors:

1. Check browser console for exact error
2. Try adding `/` at end of backend URL in `config.js`
3. Contact InfinityFree support if persists

---

## Feature Toggles in config.js

You can control behavior without uploading files again:

```javascript
features: {
    useMysqlBackend: true,        // true = send to database, false = localStorage only
    useLocalStorageBackup: true,  // Always save orders to browser (safety backup)
    enableDebugLogging: true      // true = show console logs, false = silent mode
}
```

---

## Quick Reference URLs

Replace `yourdomain.freeinfohst.com` with your actual domain:

**API Endpoints:**

- Get Products: `https://yourdomain.freeinfohst.com/backend/products.php?action=get_products`
- Get Orders: `https://yourdomain.freeinfohst.com/backend/orders.php?action=get_orders`
- Get Customer Orders: `https://yourdomain.freeinfohst.com/backend/orders.php?action=get_customer_orders&email=user@example.com`
- Initialize DB: `https://yourdomain.freeinfohst.com/backend/setup_database.php`

**Status Check:**

- Products: `https://yourdomain.freeinfohst.com/backend/products.php?action=get_products` (should return JSON with 4 products)
- Orders: `https://yourdomain.freeinfohst.com/backend/orders.php?action=get_orders` (should return JSON array)

---

## Next Steps

After successful connection:

1. **Monitor Orders** - Check backend orders endpoint regularly
2. **Add Admin Dashboard** - Create page to view all orders
3. **Email Notifications** - Add PHP mail() to send order confirmations
4. **Inventory Tracking** - Use stock_quantity field in products table
5. **Customer Analytics** - Query customers table for insights

---

## Support Checklist

Before contacting support, verify:

- [ ] PHP files uploaded to `/public_html/backend/`
- [ ] `config.php` has correct password and database name
- [ ] `config.js` has correct domain name
- [ ] Direct URL test shows JSON response
- [ ] Browser console (F12) shows [BRAMANDA] logs
- [ ] Database was initialized via `setup_database.php`
- [ ] InfinityFree account shows database as "Active"

---

Good luck! 🚀 Your BRAMANDA site is now connected to MySQL!
