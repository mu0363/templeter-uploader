const cloudinary = require('cloudinary').v2;
const db = require('/Users/ai-relations/Documents/workspace/templeter-uploader/lib/firebase-admin.js');
const getSheetData = require('/Users/ai-relations/Documents/workspace/templeter-uploader/lib/getSheetData.js');

const cloudinary_api_key = '894874241817739';
const cloudinary_api_secret = 'H59GBSCnOARhOYuZPm4O63Lo8x0';

//アップロード処理関数
const uploadVideo = async () => {
  const fileName = await getSheetData();
  //アップロードするファイルの絶対パス
  const filepath = `/Users/ai-relations/Desktop/templater/output/${fileName}.mp4`;
  //cloudinaryのアカウント名
  const cloud_name = 'dow3abe9e';
  //cloudinaryのアップロード先パス
  const public_id = `templater/${fileName}`;

  //cloudinaryコンフィグセット
  cloudinary.config({
    cloud_name,
    api_key: cloudinary_api_key,
    api_secret: cloudinary_api_secret,
  });

  //Cloudinaryへアップロード
  cloudinary.uploader.upload(
    filepath,
    {
      resource_type: 'video',
      public_id,
      overwrite: true,
    },
    function (error, result) {
      //返却されたurlデータをdataに格納
      const data = {
        url: result.url,
        createdAt: new Date(),
        public_id,
        cloud_name,
      };
      //firestoreに書き込み
      const urlRef = db.collection('urls');
      const ref = urlRef.doc();
      const id = ref.id;
      data.id = id;
      console.log(data);

      urlRef
        .doc(id)
        .set(data)
        .then(() => {
          console.log('Done!!');
        });
    }
  );
};

uploadVideo();
