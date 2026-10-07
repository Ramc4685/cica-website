/**
 * CICA Sponsor Form - Google Apps Script
 * 
 * This script handles form submissions from the sponsor inquiry form
 * and appends the data to a Google Sheet.
 */

// Configuration
const SHEET_ID = "1JIYnzppGzJxy7mUKl7DhKd3ZrtMABP_QsqmbfPsG6qU";
const SHEET_NAME = "Sponsor Inquiries";

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
    if (!data.fullName || !data.company || !data.email || !data.interest) {
      return jsonResponse({ 
        success: false, 
        message: "Missing required fields" 
      });
    }
    
    // Access spreadsheet
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "Timestamp", 
        "Full Name", 
        "Company", 
        "Email", 
        "Phone", 
        "Interest", 
        "Message"
      ]);
    }
    
    // Append data
    sheet.appendRow([
      new Date(),
      data.fullName || "",
      data.company || "",
      data.email || "",
      data.phone || "",
      data.interest || "",
      data.message || ""
    ]);
    
    return jsonResponse({ 
      success: true, 
      message: "Thank you for your interest in sponsoring CICA!" 
    });
    
  } catch (error) {
    return jsonResponse({ 
      success: false, 
      message: "An error occurred while processing your submission. Please try again later." 
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
    message: "CICA Sponsor Form endpoint is online" 
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
