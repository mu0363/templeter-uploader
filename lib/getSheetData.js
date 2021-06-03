const { google } = require('googleapis');

//シート情報
const sheetInfo = {
  spreadsheetId: '19-2SrRiR1ka7xquzhamVKiN4Hrx7OM7dFAMgVr5otQc',
  usernameRange: 'streaming!B:B',
  outputRange: 'streaming!C:C',
  renderStatusRange: 'streaming!D:D',
};

/**
 *スプレッドシートの情報を取得
 */
const getSheetData = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile:
      '/Users/ai-relations/Documents/workspace/templeter-uploader/credentials/credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({
    version: 'v4',
    auth: client,
  });

  //スプレドシートのrender-statusを読み込む
  const getStatus = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId: sheetInfo.spreadsheetId,
    range: sheetInfo.renderStatusRange,
  });

  //render-status、最後のdoneを取得
  let lastDone = 0;
  getStatus.data.values.map((status, index) => {
    if (status[0] === 'done') {
      lastDone = index;
    }
  });

  //usernameを取得
  const getUsername = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId: sheetInfo.spreadsheetId,
    range: sheetInfo.usernameRange,
  });

  //outputを取得
  const getOutputName = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId: sheetInfo.spreadsheetId,
    range: sheetInfo.outputRange,
  });

  //アップロードするファイル名(拡張子なし)
  const username = getUsername.data.values[lastDone].toString();
  const fileName = getOutputName.data.values[lastDone].toString();
  return { username, fileName };
};

module.exports = getSheetData;
