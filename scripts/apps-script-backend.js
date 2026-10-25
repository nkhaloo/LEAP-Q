/* Google Apps Script backend. See README.md for deployment instructions. */
var SPREADSHEET_ID = '121p3XrVm4ssktWA2lbexkFAHo-MPBnNENyMQOrvL78A';
var TARGET_SHEET_ID = 0;
var ALLOWED_ORIGINS = ['https://nkhaloo.github.io', 'http://localhost:8000', 'http://127.0.0.1:8000'];

function doGet() {
  return ContentService.createTextOutput('LEAP-Q receiver is running. Submit questionnaires from the survey website.');
}

function doPost(e) {
  var p = (e && e.parameter) || {};
  var result = {type:'leapq-submission', nonce:String(p.nonce || ''), submission_id:'', ok:false};
  var origin = String(p.origin || '');
  if (ALLOWED_ORIGINS.indexOf(origin) === -1) {
    return HtmlService.createHtmlOutput('This survey origin is not configured.');
  }
  try {
    if (!/^[a-f0-9-]{36}$/i.test(result.nonce)) throw new Error('Invalid request nonce.');
    if (!p.payload || p.payload.length > 100000) throw new Error('Invalid or oversized submission.');
    var payload = JSON.parse(p.payload);
    result.submission_id = payload.submission_id;
    if (!/^[a-f0-9-]{36}$/i.test(payload.submission_id || '')) throw new Error('Invalid submission ID.');
    if (payload.version !== LeapQ.version) throw new Error('Questionnaire version mismatch. Please contact the researcher.');
    var a = payload.answers;
    if (!a || typeof a !== 'object' || Array.isArray(a)) throw new Error('Missing questionnaire answers.');
    // Only accept defined fields and primitive values. Never store caller-supplied columns.
    var clean = {};
    LeapQ.fields.forEach(function(f) {
      var v = a[f.key];
      if (v === undefined) v = f.type === 'checkbox' ? false : '';
      if (f.type === 'checkbox') {
        if (typeof v !== 'boolean') throw new Error('Invalid checkbox response.');
      } else if (typeof v !== 'string' || v.length > 5000) {
        throw new Error('Invalid response for ' + f.label + '.');
      }
      clean[f.key] = typeof v === 'string' ? v.trim() : v;
    });
    var errors = LeapQ.validate(clean);
    if (errors.length) throw new Error(errors[0].message);
    // Clear answers belonging to language slots that were removed during editing.
    var count = LeapQ.languages(clean).length;
    for (var i = count + 1; i <= 5; i++) {
      LeapQ.percentages.forEach(function(g) { clean[g.id + '_' + i] = ''; });
      LeapQ.fields.forEach(function(f) { if (f.key.indexOf('l' + i + '_') === 0) clean[f.key] = ''; });
    }
    saveResponse_(payload.submission_id, clean);
    result.ok = true;
  } catch (error) {
    console.error(error);
    result.error = /^(Please |Question |List |Only list |Identification |Age |Years |Language |A country |A family |A school |Invalid |Missing |Questionnaire version)/.test(error.message)
      ? error.message : 'The response could not be saved. Please contact the researcher or try again.';
  }
  // HtmlService runs inside an Apps Script sandbox iframe. top is the GitHub Pages
  // window; an explicit target origin and unpredictable nonce bind the acknowledgement.
  var json = JSON.stringify(result).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  var target = JSON.stringify(origin);
  return HtmlService.createHtmlOutput('<!doctype html><html><body><script>window.top.postMessage(' + json + ',' + target + ');</script></body></html>')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function saveResponse_(id, a) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var book = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = book.getSheets().filter(function(s) { return s.getSheetId() === TARGET_SHEET_ID; })[0];
    if (!sheet) throw new Error('The configured sheet tab does not exist.');
    var headers = ['received_at_utc', 'submission_id', 'questionnaire_version'].concat(LeapQ.fields.map(function(f) { return f.key; }));
    if (sheet.getMaxColumns() < headers.length) sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    } else {
      var existing = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
      if (existing.some(function(v, j) { return v !== headers[j]; })) throw new Error('Sheet headers do not match. Use an empty tab or restore the LEAP-Q headers.');
    }
    // Deduplicate a retry after an acknowledgement timeout, under the same lock.
    if (sheet.getLastRow() > 1) {
      var found = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).createTextFinder(id).matchEntireCell(true).findNext();
      if (found) return;
    }
    var row = [new Date().toISOString(), id, LeapQ.version].concat(LeapQ.fields.map(function(f) {
      var value = a[f.key];
      if (f.type === 'checkbox') return value ? 'Yes' : 'No';
      if (value === undefined || value === '') return '';
      if (['rating', 'percent', 'age', 'years', 'months'].indexOf(f.type) !== -1) return Number(value);
      // Prevent spreadsheet formula injection in free-text cells.
      return /^[=+\-@\t\r\n]/.test(value) ? "'" + value : value;
    }));
    sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length).setValues([row]);
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }
}
