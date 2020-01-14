const pdfFiller = require('pdffiller');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const sourcePDF = "./pdf/tlc-transfer-app.pdf";
const destinationPDF =  "./output/completed.pdf";


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), listData);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Prints the PII obtained from the Google Form the potential partner filled out
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */

let sheetsData;

function listData(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '11wyyXdQXyZtdhW-NYIItEOyrRsjMi6Ezd-ZV4JjDOUY',
    //Fetch columns A to P
    range: 'input!A2:P',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      // Print columns A to D, which correspond to indices 0 and 4.
      sheetsData = rows.map((row) => {
        console.log(`${row[0]}, ${row[4]}`);
      });
    } else {
      console.log('No data found.');
    }
  });
}

let data = {
   Name: 'Christos Kotsonis',
  'Mailing Address': '91 Zoe Street',
  City: 'Staten Island',
  State: 'NY',
  Zip: '10305',
  undefined_11: '125-64-5621',
  'Cell phone': '347',
  undefined_12: '365',
  undefined_13: '0919',
  'Email Address': 'cremix2@yahoo.com',
  'Residence Address No PO Boxes': '91 Zoe Street',
  City_2: 'Staten Island',
  State_2: 'NY',
  Zip_2: '10305',
  'VEHICLE ID_2': '4T1BD1FK8CU046695',
  YEAR_2: '2012',
  PLATE_2: 'T742597C',
  MAKE_2: 'Toyota',
  NAME: 'Max De Jesus',
  'MAILING ADDRESS': '601 Carpenter Pl',
  CITY: 'Ridgefield',
  STATE: 'NJ',
  ZIP: '07657',
  undefined_20: '201',
  undefined_21: '686',
  undefined_22: '0682',
  'OF SHARES': '',
  SS_2: '888',
  undefined_23: '77',
  undefined_24: '6666',
  'DRIVER LICENSE': '695439',
  Name_2: 'Max De Jesus',
  Title: 'Sole-Propietor',
  Date_2: '12/28/2019',
  Name_3: 'Max De Jesus',
  'Entity Name either applicant name  base or SHL permit holder': 'Max De Jesus',
  'with the vehicle identification number': '4T1BD1FK8CU046695',
  'Print Name': 'Max De Jesus',
  Date_3: '10/27/2019',
  'Print Name_2': 'Maximinio De Jesus',
  Date_4: '10/27/2019',
  Group4: 'Choice1',
  Group6: 'Choice2',
  Group7: 'Choice2',
  Group8: 'Choice2',
  Group9: 'Choice1',
  Group13: 'Choice1',
  Group17: 'Choice12',
  Group18: 'Choice2',
  Group19: 'Choice1',
  Group24: 'Choice1', //DONE
  Group25: 'Choice1', //DONE
  Button5: '',
  'BASE  AUTHORITY NAME': 'Gewesen Transportation Corp',
  'BASE LICENSE': 'B03278',
  'BASE  AUTHORITY NAME_2': 'Amerikanisch Services Corp',
  'BASE LICENSE_2': 'B03279'
}

pdfFiller.fillForm( sourcePDF, destinationPDF, data, function(err) {
    if (err) throw err;
    console.log("In callback (we're done).");
});
