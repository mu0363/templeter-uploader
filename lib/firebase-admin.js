const admin = require('firebase-admin');

//firestore初期化
const serviceAccount = require('/Users/ai-relations/Documents/workspace/templeter-uploader/credentials/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

module.exports = db;
