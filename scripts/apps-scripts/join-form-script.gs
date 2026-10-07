/**
 * CICA Join Updates Form - Google Apps Script
 * 
 * This script handles form submissions from the "Join CICA for updates" form
 * and appends the data to a Google Sheet.
 */

// Configuration
const SHEET_ID = "1RrGkgQMNR0_8IYXwp7W0uiLu-BZJSzlWYNLrsD9XgRQ";
const SHEET_NAME = "Join Updates Form";

/**
 * doPost - Handles POST requests from the form
 * @param {Object} e - The event object containing form data
 * @return {Object} JSON response with success/error message
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  
  try {
    // Acquire lock to prevent concurrent write operations
    lock.waitLock(30000);
    
    // Validate request
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ 
        success: false, 
        message: "Invalid request format" 
      });
    }
    
    // Parse data
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!data.name || !data.email) {
      return jsonResponse({ 
        success: false, 
        message: "Name and email are required" 
      });
    }
    
    // Access spreadsheet
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(["Timestamp", "Name", "Email", "Phone"]);
    }
    
    // Append data
    sheet.appendRow([
      new Date(),
      data.name,
      data.email,
      data.phone || ""
    ]);
    
    return jsonResponse({ 
      success: true, 
      message: "Thank you for joining CICA updates!" 
    });
    
  } catch (error) {
    return jsonResponse({ 
      success: false, 
      message: "Failed to process your subscription. Please try again later." 
    });
  } finally {
    // Always release the lock
    lock.releaseLock();
  }
}

/**
 * doGet - Handles GET requests to check if the endpoint is working
 * @return {Object} Simple status message
 */
function doGet() {
  return jsonResponse({ 
    status: "active",
    message: "CICA Join Updates Form endpoint is online" 
  });
}

/**
 * Helper function to create consistent JSON responses
 * @param {Object} data - The data to return as JSON
 * @return {TextOutput} The formatted JSON response
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
