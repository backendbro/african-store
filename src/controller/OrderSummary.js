// Helper function to share the spreadsheet with a specified email address
const { google } = require("googleapis");
const Order = require("../model/Order");
const path = require("path");

// Set up authentication with your service account including Drive scope
const auth = new google.auth.GoogleAuth({
  keyFile: {
    type: "service_account",
    project_id: "contract-ai-453807",
    private_key_id: "34a0824f48ff86813c59bb8d9fb9d2e4d138c010",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDUDVe4GFhdRAo/\n9jpnMPTk0yOhkmmoa00UUStlfckCEBWh66hfiWKyRDzWkmCSB5TIypeGebcs1Ybj\nXvZCmIZkrubV71IKtZmKNIYNzF4lYciR1jXVFgwk/gVw+Y6OmXgXpgimCCa44j+z\npo3g/OmUO1cmZ/Wg0KUU77QFcamnydb6NC1kXZFq4KZIBuf0lNx/wDZE4xdDrT/h\nmeDOf9pPFVr5pccjryTnq//mA8v9PxDUAc5HpyUY6TyyLRue6jpfFweMEtIrkVZm\nduXi1sh+W80Cab9c9+1nGbod/fpuikmzC9QGxGGDsEXsRrn7CujboxbFDM6WCaII\nAsswSH1HAgMBAAECggEAP2jsAbd5+Q3HGOBbD4+Cs8h1f7PGF6BakMhC91r5WD4S\nEfTjyQnOsysXnDxyV0igE7kNPZ+5CFWju+siLcDpc0Mf8PpbKKusSbkyGv8xafFH\nJmENgPZSVF+HpgRiPj8jO8MhE/EdDy1Myj50b8KBYJusEGaG+3tY2h1h0jzudCcq\nXEbxzMXMxW7IYx5HGfiBJk1zLrLycP+ol7fI3E91JWrJig6kyOEe4qFDEBBJid/F\n2I/OvsX2nTKPKoaqnWyWObdxKqObODJqlwSoOkEowt75qX6UM+Ritm6q3WA9t5lC\nQJH5WAfN4xxyoOYNAKOCbcd9zstWN7VEiKpIGKj4WQKBgQDtlR4YtaLhZ7Q5RLGK\nzg+cNAAaxHLQRFaveJKkL7KioXL/sdA4vBjfhlpYQhvJ/8x1tPOLfe0UPpAk63Z0\nv+m2ZxzMVoW5DXRt9yVoUiMY1iKT/CnV9gEGNsVI4SohdsjE32/VIbDHSUqeLaDK\nvWtwAm7aEPl5cJTawXQIqtgyeQKBgQDkfZGTi+b7tXSFtANv5HkgkZOpQHEZNMbx\nZbY+8A/Ms4vI0k4TmaAppqD1BvAhrbHVgGRPBTS6VCnrA96drHPYhv6M0zd5A88b\nsB0Siskv/juolqMdgq0dsIYrO6aGTSenK9HyULF5n850qGL9DwwLHCBUAP6VAPBl\nW2iPf5Q9vwKBgQC1EAIB3tulYT1ur7WHDYfECbVSsQi3RH2z+PX4/wjq/JQB3mfL\n9T4Xi/LqdGdtSO9vfVpmoq+9z/hWysRaMbBR/L9r0zzSTTjAXaw6lu58jSWJFpJj\np7ocHD26Ty+mlTppH8fA7I4nMuoVJrz2BeoNUS1eL7WRIYWwOeLOgDWIMQKBgFsU\nYs852V1Eu6oAU85qeI4u+XliIrM1gof/T2JPNz0V5QasLktJ1bpEnayOk3IZVuYQ\nQ+vr21Ta78qqxDZ947/QL+/a0iX/CrOyxCP8Bq6G3SkawvKkgHVxREo/gOXQI5pT\nsWCyIcylkxqVdMADG33iPFDABLtIoIsGoOtyo5jpAoGAZAYoHboe6jxU+KY03NKU\n4fkYMscNOogqdD/gCeny+IEXRwcI1R6espUQdeBWo2Z7qQ6uikGMMLkrXm/po2lf\nZgDVD9i+tY8MbFWpdQMZ0CSOVC+CES5ByB1xfV7Et2VE2VU62MbJz+7nRNsQrTll\nnpPloEPbeMz2n0c0NTdf1uU=\n-----END PRIVATE KEY-----\n",
    client_email: "africanstore@contract-ai-453807.iam.gserviceaccount.com",
    client_id: "109619164587319555589",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/africanstore%40contract-ai-453807.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  }, // Absolute path relative to the current file
  //keyFile: path.join(__dirname, "google.json"), // Absolute path relative to the current file
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
