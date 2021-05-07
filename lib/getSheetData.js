const { google } = require('googleapis');

/**
 * render-status列とoutput列を設定
 */
//render-status列
const renderStatusRange = 'streaming!C:C';

//output列
const outputRange = 'streaming!B:B';

const spreadsheetId = '19-2SrRiR1ka7xquzhamVKiN4Hrx7OM7dFAMgVr5otQc';

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

  //スプレドシート(streaming)のrender-status(C列)を読み込む
  const getStatus = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: renderStatusRange,
  });

  //render-status(C列)、最後のdoneを取得
  let lastDone = 0;
  getStatus.data.values.map((status, index) => {
    if (status[0] === 'done') {
      lastDone = index;
    }
  });

  //output(B列)を取得
  const getOutputName = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: outputRange,
  });

  //アップロードするファイル名(拡張子なし)
  const fileName = getOutputName.data.values[lastDone].toString();
  return fileName;
};

module.exports = getSheetData;
