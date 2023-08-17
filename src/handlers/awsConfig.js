const AWS = require('aws-sdk');
const fileUpload = require('express-upload');

AWS.config.update({region:'eu-north-1'});
s3= new AWS.S3({
    credentials:{
        accessKeyId:process.env.S3_ACCESS_KEY,
        secretAccessKey:process.env.S3_SECRET_ACCESS_KEY
    }
})
