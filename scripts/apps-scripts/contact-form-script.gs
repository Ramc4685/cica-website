// Google Apps Script for CICA Contact Form

// Set the name of the Google Sheet where you want to store the data
const SHEET_NAME = "Contact Form Submissions";

// Define the headers for your Google Sheet
const SHEET_HEADERS = [
  "Timestamp", 
  "FirstName", 
  "LastName", 
  "Email", 
  "Phone"
];

/**
 * Handles HTTP POST requests to the web app.
 * This function is the entry point for your web app.
 */
function doPost(e) {
  // Use a lock to prevent concurrent modifications, which can cause issues.
  const lock = LockService.getScriptLock();
  lock.waitLock(30000); // Wait up to 30 seconds.

  try {
    // Open the spreadsheet and get the sheet by name.
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = doc.getSheetByName(SHEET_NAME);

    // If the sheet doesn't exist, create it and add the headers.
    if (!sheet) {
      sheet = doc.insertSheet(SHEET_NAME);
      sheet.appendRow(SHEET_HEADERS);
    }

    // Parse the JSON data from the request body.
    const requestData = JSON.parse(e.postData.contents);

    // Create a new row with the form data. The order must match SHEET_HEADERS.
    const newRow = [
      new Date(), // Timestamp
      requestData.firstName || "",
      requestData.lastName || "",
      requestData.email || "",
      requestData.phone || "",
      requestData.subject || "",
      requestData.message || ""
    ];

    // Append the new row to the sheet.
    sheet.appendRow(newRow);

    // Return a success response to the client.
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: "Form submitted successfully" })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log the error for debugging.
    console.error("Error in doPost: ", error);

    // Return an error response to the client.
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: "An error occurred: " + error.message })
    ).setMimeType(ContentService.MimeType.JSON);

  } finally {
    // Release the lock.
    lock.releaseLock();
  }
}
