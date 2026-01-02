# FileZilla Setup Guide - Upload Files to InfinityFree

## What is FileZilla?

FileZilla is a free FTP client that lets you upload files from your computer to your InfinityFree hosting server. Think of it as a file manager for your web server.

---

## STEP 1: Download FileZilla

### Option A: From Official Website (Recommended)

1. Go to: https://filezilla-project.org/
2. Click **"Download FileZilla Client"** (blue button)
3. Choose your operating system:
   - **Windows** → Download .exe file
   - **Mac** → Download .dmg file
   - **Linux** → Download your version

### Option B: From Microsoft Store (Windows Only)

1. Open Microsoft Store
2. Search: "FileZilla"
3. Click Install

---

## STEP 2: Install FileZilla

### Windows:

1. Find the downloaded `.exe` file
2. Double-click to run installer
3. Click **"I Agree"** to license
4. Click **"Next"** through all screens
5. Click **"Finish"**
6. FileZilla should open automatically

### Mac:

1. Open the `.dmg` file
2. Drag FileZilla icon to Applications folder
3. Open Applications → double-click FileZilla

### Linux:

Follow your package manager or compile from source (see FileZilla docs)

---

## STEP 3: Get Your FTP Credentials from InfinityFree

You need your FTP login information.

### How to Find FTP Credentials:

1. Log in to InfinityFree: https://www.infinityfree.com/
2. Click **"My Accounts"** or go to Control Panel
3. Find your account in the list
4. Look for **"FTP Accounts"** or **"FTP Details"**
5. You should see something like:

```
FTP Hostname: bramanda.freeinfohst.com
FTP Username: if0_xxxxx (or ifxxxxxx_bramanda)
FTP Password: yourpassword
Port: 21
```

**SAVE THESE DETAILS!** You'll need them in the next step.

### If You Can't Find FTP Details:

1. Go to InfinityFree Control Panel
2. Click **"FTP Accounts"**
3. Click **"Add FTP Account"**
4. Create account with:
   - **FTP Account Name:** bramanda
   - **Password:** (create a strong password)
5. Click Create
6. Copy the credentials shown

---

## STEP 4: Connect FileZilla to InfinityFree

### Method 1: Manual Connection (Easiest for First Time)

1. **Open FileZilla**

2. **Find the Host Field** (top left area):
   - You should see fields labeled: Host, Username, Password, Port

3. **Enter Your Credentials:**

   ```
   Host: bramanda.freeinfohst.com
   Username: if0_xxxxx
   Password: yourpassword
   Port: 21
   ```

   **Example:**
   ```
   Host: bramanda.freeinfohst.com
   Username: if0_40589405_bramanda
   Password: MySecurePass123
   Port: 21
   ```

4. **Click "Quickconnect"** button (right side of those fields)

5. **Wait 5-10 seconds** for connection

### Expected Result:

- **Left side** shows your computer files
- **Right side** shows server files (this should appear now)
- Bottom shows: "Status: Connected to bramanda.freeinfohst.com"

---

## STEP 5: Save Connection (Optional but Recommended)

Once connected, save it for next time:

1. Go to **File** menu → **Site Manager**
2. Click **"New Site"**
3. Name it: `BRAMANDA`
4. Set Protocol: `FTP - File Transfer Protocol`
5. Host: `bramanda.freeinfohst.com`
6. Port: `21`
7. Logon Type: `Normal`
8. User: `if0_xxxxx`
9. Password: `yourpassword`
10. Click **"Connect"**

Now you can just double-click this site in future to reconnect!

---

## STEP 6: Navigate to Public HTML

Once connected, you need to find the `/public_html/` folder where your website files go.

### What You'll See:

**Right side (server)** should show folders like:
- `public_html` ← This is your website root
- `tmp`
- `etc`

### Navigate to It:

1. **Double-click `public_html`** on the right side
2. Now you should see your website files:
   - `index.html`
   - `html` folder
   - `css` folder
   - `js` folder
   - `img` folder
   - `backend` folder (if you already created it)

If you don't see a `backend` folder, you'll create it in the next step.

---

## STEP 7: Create Backend Folder (If Needed)

If `/public_html/backend/` doesn't exist:

1. **Right-click in the empty space** on the right side (server)
2. Select **"Create directory"**
3. Type: `backend`
4. Press Enter
5. The folder should appear in the list

---

## STEP 8: Upload Your PHP Files

### Step 8A: Create Folder Structure on Your Computer

On your PC, create this folder structure in your Documents:

```
C:\Users\Mash\Documents\bram\Bramanda 2.0 website\backend_files_to_upload\
├── config.php (UPDATED with your credentials)
├── setup_database.php
├── orders.php
└── products.php
```

Save all 4 files in this folder.

### Step 8B: Upload PHP Files to Backend Folder

1. **On the right side**, double-click to open the `backend` folder
2. **On the left side**, navigate to where you saved those 4 PHP files
3. **Select all 4 files** (Ctrl+A or Shift+Click)
4. **Drag them to the right side** OR right-click → "Upload"
5. Watch the progress bar at bottom
6. When done, they should appear on the right side

**Result should show:**
```
backend/
├── config.php ✓
├── setup_database.php ✓
├── orders.php ✓
└── products.php ✓
```

---

## STEP 9: Upload JavaScript Files

### Update and Upload `config.js`

Before uploading, make sure you updated `config.js` with your domain!

1. **On the right side**, navigate back to `/public_html/js/`
2. **On the left side**, find your updated `config.js`
3. **Drag it to the right side** to upload
4. FileZilla may ask "Overwrite?" → Click **"Yes"** (only if uploading updated version)

### Upload Updated `main.js`

Same process:
1. Right side: `/public_html/js/`
2. Left side: Find updated `main.js`
3. Drag to right side
4. This **replaces** the old version

---

## STEP 10: Upload HTML Files

### Upload Updated `index.html`

1. **On the right side**, navigate to `/public_html/html/`
2. **On the left side**, find updated `index.html`
3. **Drag to right side**
4. Click **"Yes"** to overwrite old version

### Upload New `admin.html`

1. **On the right side**, stay in `/public_html/html/`
2. **On the left side**, find `admin.html`
3. **Drag to right side**
4. This is a new file, so no overwrite

---

## STEP 11: Verify All Files Uploaded

Check that all these files exist on the server:

```
public_html/
├── backend/
│   ├── config.php ✓
│   ├── setup_database.php ✓
│   ├── orders.php ✓
│   └── products.php ✓
├── js/
│   ├── config.js ✓
│   ├── main.js ✓
│   └── (other js files)
├── html/
│   ├── index.html ✓
│   ├── admin.html ✓
│   └── (other html files)
└── (other folders)
```

**In FileZilla:**
1. Navigate through folders on right side
2. Verify each file appears
3. Check file sizes match your local copies

---

## STEP 12: Test PHP Files Exist

### Visit These URLs in Browser:

**Test 1: Setup Database**
```
https://bramanda.freeinfohst.com/backend/setup_database.php
```

Expected: JSON response with ✓ messages

**Test 2: Get Products**
```
https://bramanda.freeinfohst.com/backend/products.php?action=get_products
```

Expected: JSON list of 4 products

**Test 3: Get Orders**
```
https://bramanda.freeinfohst.com/backend/orders.php?action=get_orders
```

Expected: JSON (empty or with orders if you tested)

If all three work, your upload was successful! ✓

---

## Common FileZilla Issues & Solutions

### "Connection refused" or "Cannot connect"

**Cause:** Wrong credentials or hostname

**Fix:**
1. Check FTP details are exactly correct (copy-paste from InfinityFree)
2. Make sure Port is `21`
3. Try clicking "Disconnect" then "Quickconnect" again
4. Wait 5-10 minutes for DNS propagation

### Files Won't Upload

**Cause:** Permission issue or file locked

**Fix:**
1. Close the file in your editor first
2. Try right-clicking file → "Upload"
3. Check FTP account is active in InfinityFree Control Panel
4. Try uploading one file at a time

### Can't See `/public_html/` Folder

**Cause:** Already in `/public_html/` (don't need to navigate)

**Fix:**
1. If right side shows `html`, `css`, `js` folders directly, you're already there
2. Otherwise, double-click folders until you find them

### Accidentally Uploaded to Wrong Folder

**Fix:**
1. Right-click file on right side → "Delete"
2. Navigate to correct folder
3. Upload again

---

## FileZilla Tips & Tricks

### Quick Upload Shortcut

1. Set up Site Manager (see Step 5)
2. Now you can just:
   - Double-click site name to connect
   - Drag files from left to right
   - Done!

### View File Permissions

Right-click file → "File Attributes" to see permissions (should be 644 for PHP files)

### Refresh File List

Press **F5** or right-click → "Refresh" to see latest server files

### Compare Local vs Server

Side-by-side comparison helps ensure uploads worked:
- **Left:** Your computer
- **Right:** Server
- Look for matching file names and sizes

---

## Final Checklist

Before moving to next steps:

- [ ] FileZilla installed
- [ ] Connected to InfinityFree (status shows "Connected")
- [ ] Can see `/public_html/` folder on right side
- [ ] Backend folder exists or created
- [ ] All 4 PHP files uploaded to `/backend/`
- [ ] Updated `config.js` uploaded
- [ ] Updated `main.js` uploaded
- [ ] Updated `index.html` uploaded
- [ ] New `admin.html` uploaded
- [ ] Can visit `setup_database.php` and see JSON response
- [ ] Can visit products/orders API endpoints and see JSON responses

---

## Next Steps

Once all files uploaded:

1. **Initialize Database** - Visit `setup_database.php`
2. **Test Admin Dashboard** - Visit `html/admin.html`
3. **Test Order Submission** - Add item to cart and checkout
4. **Verify in Database** - Orders should appear

---

## Quick Reference

**FileZilla Windows Shortcut:**
- Ctrl+E → Recent Sites
- Ctrl+Q → Quit
- F5 → Refresh
- Ctrl+A → Select all

**FTP Connection Reminder:**
```
Hostname: bramanda.freeinfohst.com
Username: if0_xxxxx
Password: yourpassword
Port: 21
```

---

## Support

If stuck:
1. Check FileZilla bottom panel for error messages
2. Verify FTP credentials in InfinityFree Control Panel
3. Try disconnecting and reconnecting
4. Check file permissions (644)

Good luck! 🚀
