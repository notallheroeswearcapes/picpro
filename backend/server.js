const express = require('express');
const cors = require('cors');
require('dotenv').config();
const AWS = require('aws-sdk');
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
const port = process.env.PORT;
imagesRouter = require('./routes/images.js');
presetsRouter = require('./routes/presets.js');

// Cloud Services Setup
AWS.config.update({
    region: process.env.REGION
});
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
const s3BucketName = process.env.S3_BUCKET_NAME;

// Server Setup
app.listen(port, (error) => {
    if (!error) {
        console.log("⚡️ Server is successfully running and listening on port " + port);
        initializeBucket();
    }
    else {
        console.log("❌ Error occurred during server startup", error);
    }
});

app.use('/images?', imagesRouter);
app.use('/presets?', presetsRouter);

function initializeBucket() {
    s3.createBucket({ Bucket: s3BucketName })
        .promise()
        .then(() => {
            console.log(`✅ Created bucket: ${s3BucketName}`);
        })
        .catch((err) => {
            if (err.statusCode == 409) {
                console.log(`ℹ Bucket already created: ${s3BucketName}`);
            } else {
                console.log(`❌ Error creating bucket: ${err}`);
            }
        });
}