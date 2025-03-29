// Helper function to share the spreadsheet with a specified email address
const { google } = require("googleapis");
const Order = require("../model/Order");
const path = require("path");

// Set up authentication with your service account including Drive scope
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "google.json"), // Absolute path relative to the current file
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive", // Needed for sharing
  ],
});

// Helper function to share the spreadsheet with a specified email address
async function shareSpreadsheet(spreadsheetId, email) {
  const drive = google.drive({ version: "v3", auth });
  await drive.permissions.create({
    fileId: spreadsheetId,
    requestBody: {
      role: "writer", // Use "reader" if you want view-only access
      type: "user",
      emailAddress: email,
    },
  });
}

exports.createOrderSummary = async (req, res) => {
  try {
    // Define the start and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch today’s orders
    const orders = await Order.find({
      created_at: { $gte: startOfDay, $lte: endOfDay },
    });
    console.log("Orders found:", orders); // Debug log

    // Prepare the data summary with a header row
    const header = [
      "Customer Name",
      "Amount Paid (€)",
      "Payment Method",
      "Order Status",
      "Number of Items",
      "Created At",
    ];
    const dataRows = orders.map((order) => [
      order.customer_name,
      order.amount_paid,
      order.payment_method,
      order.order_status,
      order.order_items.length,
      order.created_at.toISOString(),
    ]);
    const values = [header, ...dataRows];

    // Create a new spreadsheet with today's date in the title
    const sheets = google.sheets({ version: "v4", auth });
    const createResponse = await sheets.spreadsheets.create({
      resource: {
        properties: {
          title: `Order Summary - ${new Date().toLocaleDateString()}`,
        },
        sheets: [
          {
            properties: {
              title: "Summary",
            },
          },
        ],
      },
    });
    const newSpreadsheetId = createResponse.data.spreadsheetId;

    // Write the summary data to the new spreadsheet
    await sheets.spreadsheets.values.update({
      spreadsheetId: newSpreadsheetId,
      range: "Summary!A1",
      valueInputOption: "USER_ENTERED",
      resource: { values },
    });

    // Share the spreadsheet with your email (update with your actual email address)
    await shareSpreadsheet(newSpreadsheetId, "nzubechukwuukagha@gmail.com");

    // Respond with the new spreadsheet URL and ID
    res.status(200).json({
      message: "Order summary created and shared successfully",
      spreadsheetId: newSpreadsheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${newSpreadsheetId}/edit`,
    });
  } catch (error) {
    console.error("Error creating order summary:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
