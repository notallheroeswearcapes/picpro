const axios = require('axios');
const express = require('express');
const sharp = require("sharp");
require('dotenv').config();
const AWS = require('aws-sdk');
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()}).single('file');
const fs = require('fs');

const router = express.Router();

// Cloud Services Setup
// Create unique bucket name
AWS.config.update({
    region: process.env.REGION
});
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
const s3BucketName = process.env.S3_BUCKET_NAME;

router.post('/upload', upload, (req, res) => {
    console.log("⚡️ Received request to /images/upload");
    console.log(req.file);
    const file = req.file;
    const fileName = req.body.name;
    sharp(file.buffer)
        .metadata()
        .then(metadataResult => {
            // use multipart upload for potentially large files
            var upload = new AWS.S3.ManagedUpload({
                params: {
                    Bucket: s3BucketName,
                    Key: fileName,
                    Body: file.buffer
                }
            });
            upload.promise()
                .then(() => {
                    console.log(`✅ Uploaded image \'${fileName}\' to \'${s3BucketName}\'`);
                    res.send(metadataResult);
                })
                .catch(error => {
                    console.error(`❌ Error during image upload to S3: ${error}`);
                });
        })
        .catch(error => {
            console.error(`❌ Error during image analysis for metadata: ${error}`);
        });
});

router.post('/fetch', (req, res) => {
    console.log("⚡️ Received request to /images/fetch");
    const fileName = req.body.name;
    const params = {
        Bucket: s3BucketName,
        Key: fileName
    }
    s3.getObject(params).promise()
        .then(data => {
            const imgBuffer = data.Body;
            sharp(imgBuffer).metadata()
                .then(metadataResult => {
                    console.log(`✅ Successfully fetched image \'${fileName}\' from \'${s3BucketName}\'`);
                    res.send({
                        name: fileName,
                        url: getDataUrlFromBuffer(imgBuffer, metadataResult.mimeType),
                        metadata: metadataResult
                    });
                })
                .catch(error => {
                    console.error(`❌ Error during image analysis for metadata: ${error}`);
                });
        })
        .catch(error => {
            console.error(`❌ Error when fetching image \'${fileName}\' from S3: ${error}`);
        });
});

// example of json response
dummy = {
    presets: {
        width: 400,
        height: 200,
        greyscale: true,
        blackwhite: false,
        brightness: false,
        bri_set: 2,
        saturation: false,
        sat_set: 0.2,
        hue: false,
        hue_set: 180,
        blur: false,
        file: "jpeg"
    }
}

router.post('/transform', (req, res) => {
    // main endpoint for image transformation, use sharp here
    console.log("⚡️ Received request to /images/transform");
    console.log(req.query.filename);

    const params = { Bucket: s3BucketName, Key: req.query.filename};
    s3.getObject(params)
        .promise()
        .then((result) => {

            console.log(result);
            let info = transform(result.Body, dummy.presets);
            res.send(info);
        })
        .catch((err) => res.json(err));
    
});

router.get('/', (_, res) => {
    console.log("⚡️ Received request to /images");

    const params = { Bucket: s3BucketName };
    const fileNames = [];
    s3.listObjectsV2(params).promise()
        .then(listRes => {
            for (var i = 0; i < listRes.Contents.length; i++) {
                fileNames.push(listRes.Contents[i].Key);
            }
            console.log(`ℹ Retrieved ${listRes.KeyCount} images from S3`);
            res.send(fileNames);
        })
        .catch(error => {
            console.error(`❌ Error during image listing from S3: ${error}`);
        });
});

function getDataUrlFromBuffer(imgBuffer, mimeType) {
    const base64 = Buffer.from(imgBuffer).toString('base64');
    return `data:image/${mimeType};base64,${base64}`;
}

async function transform(image, presets) {
    // resize image
    let info = await sharp(image).resize(presets.width, presets.height);
    let localEdit;
    let filename;
    let buffer;

    // greyscale
    if (presets.greyscale) {
        info = await info.greyscale();
    }
    // black and white
    if (presets.blackwhite) {
        info = await info.threshold(100);
    }

    // brightness
    if (presets.brightness) {
        info = await info.modulate({
            brightness: presets.bri_set,
        });
    }
    // saturation
    if (presets.saturation) {
        info = await info.modulate({
            saturation: presets.sat_set,
        });
    }
    // hue
    if (presets.hue) {
        info = await info.modulate({
            hue: presets.hue_set,
        });
    }

    // blur
    if (presets.blur) {
        info = await info.blur(15);
    }

    // transcode png
    if (presets.file == "png") {
        filename = "edit.png"
        buffer = await info.png().toBuffer();

        localEdit = "../../image/edit.png"
        info = await info.png().toFile(localEdit);
    }
    // transcode jpeg
    if (presets.file == "jpeg") {
        filename = "edit.jpeg"
        buffer = await info.jpeg().toBuffer();

        localEdit = "../image/edit.jpeg"
        info = await info.jpeg().toFile(localEdit);
    }

    console.log(filename);
    console.log(buffer);

    var upload = new AWS.S3.ManagedUpload({
        params: {
            Bucket: s3BucketName,
            Key: filename,
            Body: buffer
        }
    });
    upload.promise()
        .then(() => {
            console.log(`✅ Uploaded image \'${filename}\' to \'${s3BucketName}\'`);
        })
        .catch(error => {
            console.error(`❌ Error during image upload to S3: ${error}`);
        });

    return(info)
}

module.exports = router;