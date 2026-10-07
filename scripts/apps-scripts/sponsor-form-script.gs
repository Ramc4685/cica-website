// Deploy this source as a new version of the existing Apps Script web app.
// Source changes alone do not update the public deployment or send email.
const SHEET_NAME = "Sponsor Inquiries";
const SHEET_ID = "1JIYnzppGzJxy7mUKl7DhKd3ZrtMABP_QsqmbfPsG6qU";
const SHEET_HEADERS = ["Timestamp", "Full Name", "Company", "Email", "Phone", "Interest", "Message"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  let acquired = false;
  try {
    if (!e || !e.postData || typeof e.postData.contents !== "string" || e.postData.contents.length > 12000) {
      return jsonResponse({ success: false, message: "Invalid request." });
    }
    const data = JSON.parse(e.postData.contents);
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Invalid input");
    data.fullName = checkedText(data.fullName, 1, 100);
    data.company = checkedText(data.company, 1, 200);
    data.email = checkedText(data.email, 1, 254);
    data.phone = checkedText(data.phone, 0, 30);
    data.interest = checkedText(data.interest, 1, 200);
    data.message = checkedText(data.message, 10, 3000);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) throw new Error("Invalid email");
    if (data.phone && (!/^[+\d\s().-]+$/.test(data.phone) || data.phone.replace(/\D/g, "").length < 7 || data.phone.replace(/\D/g, "").length > 15)) throw new Error("Invalid phone");
    acquired = lock.tryLock(5000);
    if (!acquired) return jsonResponse({ success: false, message: "The form is busy. Please contact the organizers." });
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.appendRow(SHEET_HEADERS);
    }
    sheet.appendRow([new Date(), safeCell(data.fullName), safeCell(data.company), safeCell(data.email), safeCell(data.phone), safeCell(data.interest), safeCell(data.message)]);
    SpreadsheetApp.flush();
    return jsonResponse({ success: true, message: "Your request has been recorded." });
  } catch (error) {
    // Never return internal spreadsheet IDs, permissions, or submitted personal data.
    return jsonResponse({ success: false, message: "We could not confirm your request. Please contact the organizers." });
  } finally {
    if (acquired) lock.releaseLock();
  }
}

function checkedText(value, minimum, maximum) {
  if (value == null && minimum === 0) return "";
  if (typeof value !== "string") throw new Error("Invalid input");
  const text = value.trim();
  if (text.length < minimum || text.length > maximum) throw new Error("Invalid input");
  return text;
}

function safeCell(value) {
  // Apostrophe forces user input to remain text rather than a spreadsheet formula.
  return /^[=+@-]/.test(value) ? "'" + value : value;
}

function doGet() {
  return jsonResponse({ status: "active", message: "CICA form endpoint is online." });
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
