// ===========================
// BRAMANDA - GOOGLE APPS SCRIPT
// Backend for Google Sheets Integration
// ===========================
//
// HOW TO SET UP:
// 1. Go to https://script.google.com
// 2. Create a new project
// 3. Copy this code into the editor
// 4. Deploy as a Web App (Deploy > New Deployment > Type: Web app)
// 5. Execute as: Your email, Anyone can access
// 6. Copy the deployment URL
// 7. Replace "YOUR_SCRIPT_ID" in main.js with your script ID from the URL
// 8. Create a Google Sheet with columns: Timestamp, Name, Email, Phone, Address, City, State, ZIP, Payment, Items, Total, Status

function doPost(e) {
  try {
    // Get the spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Orders") || ss.insertSheet("Orders");

    // Parse incoming data
    const data = JSON.parse(e.postData.contents);

    // Prepare items list
    let itemsList = "";
    if (data.items && Array.isArray(data.items)) {
      itemsList = data.items
        .map((item) => `${item.name} x${item.quantity}`)
        .join(", ");
    }

    // Add header row if first time
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Name",
        "Email",
        "Phone",
        "Address",
        "City",
        "State",
        "ZIP",
        "Payment Method",
        "Items Ordered",
        "Total Amount",
        "Status",
      ]);
    }

    // Add order data to sheet
    sheet.appendRow([
      data.timestamp,
      data.name,
      data.email,
      data.phone,
      data.address,
      data.city,
      data.state,
      data.zip,
      data.payment,
      itemsList,
      "₹" + data.total.toFixed(2),
      data.status,
    ]);

    // Send confirmation email
    sendOrderConfirmation(data);

    return ContentService.createTextOutput(
      JSON.stringify({
        result: "success",
        message: "Order received",
        orderId: Utilities.getUuid(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log("Error: " + error);
    return ContentService.createTextOutput(
      JSON.stringify({
        result: "error",
        message: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendOrderConfirmation(data) {
  try {
    const subject = `BRAMANDA Order Confirmation - ${data.name}`;
    const htmlBody = `
            <html>
                <body style="font-family: Arial; background: #0d0d0d; color: #fff; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background: #1a1a1a; padding: 30px; border: 3px solid #ff4500;">
                        <h1 style="color: #ff4500; text-transform: uppercase; letter-spacing: 2px;">BRAMANDA</h1>
                        <h2 style="color: #ffff00;">Order Confirmed!</h2>
                        
                        <p>Thank you for your order, <strong>${
                          data.name
                        }</strong>!</p>
                        
                        <h3 style="color: #ff4500; margin-top: 30px;">Order Details</h3>
                        <div style="background: #2a2a2a; padding: 15px; border-left: 4px solid #ff4500; margin: 20px 0;">
                            <p><strong>Items:</strong> ${data.items
                              .map((item) => `${item.name} x${item.quantity}`)
                              .join("<br>")}</p>
                            <p style="font-size: 1.2em; color: #ffff00;"><strong>Total: ₹${data.total.toFixed(
                              2
                            )}</strong></p>
                            <p><strong>Payment Method:</strong> ${
                              data.payment
                            }</p>
                        </div>
                        
                        <h3 style="color: #ff4500; margin-top: 30px;">Shipping To</h3>
                        <div style="background: #2a2a2a; padding: 15px; border-left: 4px solid #ff4500; margin: 20px 0;">
                            <p>${data.address}<br>
                            ${data.city}, ${data.state} ${data.zip}</p>
                        </div>
                        
                        <p style="color: #ff6600; margin-top: 30px;">
                            <strong>Status:</strong> Your order is being processed. You'll receive a shipping update within 24 hours.
                        </p>
                        
                        <p style="margin-top: 30px; color: rgba(255,255,255,0.7); font-size: 0.9em;">
                            For any questions, contact us at info@bramanda.com
                        </p>
                        
                        <hr style="border: 1px solid #ff4500;">
                        <p style="text-align: center; color: rgba(255,255,255,0.6); font-size: 0.8em;">
                            © ${new Date().getFullYear()} BRAMANDA. Raw. Real. Unstoppable.
                        </p>
                    </div>
                </body>
            </html>
        `;

    GmailApp.sendEmail(data.email, subject, "", { htmlBody: htmlBody });
  } catch (error) {
    Logger.log("Email error: " + error);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      message: "BRAMANDA Order API v1.0",
      status: "ready",
    })
  ).setMimeType(ContentService.MimeType.JSON);
}
