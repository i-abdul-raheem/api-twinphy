const { s3 } = require("../handlers/S3");
const router = require("express").Router();
const {User} = require('../models/user.model')
router.post("/", (req, res) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  let keyName = uniqueSuffix + req.files.avatar.name;
  s3.upload(
    {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: keyName,
      Body: req.files.avatar.data,
      ContentDisposition: "inline",
    },
    (err, data) => {
      if (err) {
        return res.status(403).json({
          message: "Can Not upload File!",
        });
      }
      return res.status(200).json({
        message: "File Uploaded successfully",
        data,
      });
    }
  );
});


module.exports = router;
