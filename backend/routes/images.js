const axios = require('axios');
const express = require('express');
const sharp = require("sharp");
require('dotenv').config();
const AWS = require('aws-sdk');
const fs = require('fs');

const router = express.Router();

// Cloud Services Setup
// Create unique bucket name
AWS.config.update({
    region: process.env.REGION
});
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
const s3BucketName = process.env.S3_BUCKET_NAME;

router.post('/upload', (req, res) => {
    console.log("⚡️ Received request to /images/upload");
    const imgBuffer = getBufferFromBase64(req.body.url);
    const fileName = req.body.name;
    sharp(imgBuffer)
        .metadata()
        .then(metadataResult => {
            // use multipart upload for potentially large files
            console.log(req.body.url.slice(0, 100));
            var upload = new AWS.S3.ManagedUpload({
                params: {
                    Bucket: s3BucketName,
                    Key: fileName,
                    Body: req.body.url
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
            // conversion does not quite work yet
            const url = getBase64FromOctetStream(data.Body);
            console.log(url.slice(0, 100));
            const imgBuffer = Buffer.from(url, 'base64');
            sharp(imgBuffer).metadata()
                .then(metadataResult => {
                    console.log(`✅ Successfully fetched image \'${fileName}\' from \'${s3BucketName}\'`);
                    res.send({
                        url: url,
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
        greyscale: false,
        blackwhite: false,
        brightness: false,
        bri_set: 2,
        saturation: false,
        sat_set: 0.2,
        hue: false,
        hue_set: 180,
        blur: true,
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
            // change this later
            console.log(result);
            // console.log(getBase64FromOctetStream(result.Body));

            let edit = transform("../image/original.png", dummy.presets);
            
            console.log(edit);
            console.log(base64_encode(edit));

            params = {
                Bucket: s3BucketName,
                Key: "edit.jpeg",
                Body: base64_encode(edit)
            }
            s3.putObject(params)
                .promise()
                .then(() => {
                    console.log(`✅ Uploaded image \'${edit}\' to \'${s3BucketName}\'`);
                    res.send({response: "hurray"});
                })
                .catch(error => {
                    console.error(`❌ Error during image upload to S3: ${error}`);
                });
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

function getBufferFromBase64(url) {
    return Buffer.from(url.split(',')[1], 'base64');
}

function getBase64FromOctetStream(stream) {
    return Buffer.from(stream).toString('base64');
}

function transform(image, presets) {
    // resize image
    let info = sharp(image).resize(presets.width, presets.height);
    let edit;

    // greyscale
    if (presets.greyscale) {
        info = info.greyscale();
    }
    // black and white
    if (presets.blackwhite) {
        info = info.threshold(100);
    }

    // brightness
    if (presets.brightness) {
        info = info.modulate({
            brightness: presets.bri_set,
        });
    }
    // saturation
    if (presets.saturation) {
        info = info.modulate({
            saturation: presets.sat_set,
        });
    }
    // hue
    if (presets.hue) {
        info = info.modulate({
            hue: presets.hue_set,
        });
    }

    // blur
    if (presets.blur) {
        info = info.blur(15);
    }

    // transcode png
    if (presets.file == "png") {
        edit = "../../image/edit.png"
        info = info.png().toFile(edit);
    }
    // transcode jpeg
    if (presets.file == "jpeg") {
        edit = "../image/edit.jpeg"
        info = info.jpeg().toFile(edit);
    }

    console.log(info);

    return edit;
}

function base64_encode(file) {
    return "data:image/gif;base64,"+fs.readFileSync(file, 'base64');
}

module.exports = router;