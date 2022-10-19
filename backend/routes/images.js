const axios = require('axios');
const express = require('express');
const sharp = require("sharp");
require('dotenv').config();
const AWS = require('aws-sdk');

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
    var imgBuffer = getBufferFromBase64(req.body.url);
    var fileName = req.body.name;
    sharp(imgBuffer)
        .metadata()
        .then(metadataResult => {
            console.log(metadataResult);
            // use multipart upload for potentially large files
            var upload = new AWS.S3.ManagedUpload({
                params: {
                    Bucket: s3BucketName,
                    Key: fileName,
                    Body: req.body.url
                }
            });
            upload.promise()
                .then(res => {
                    console.log(res);
                })
                .catch(error => {
                    console.error(`❌ Error during image upload to S3: ${error}`);
                });
            res.send(metadataResult);
        })
        .catch(error => {
            console.error(`❌ Error during image analysis for metadata: ${error}`);
        });
});

// example of json response
// {
//     presets: {
//         image: "insert s3 url,
//         width: 400,
//         height: 200,
//         greyscale: false,
//         blackwhite: false,
//         brightness: true,
//         bri_set: 2,
//         saturation: false,
//         sat_set: 0.2,
//         hue: false,
//         hue_set: 180,
//         blur: false,
//         file: "jpeg"
//     }
// }

router.post('/transform', (req, res) => {
    // main endpoint for image transformation, use sharp here
    console.log("⚡️ Received request to /images/transform");

    // const params = { Bucket: bucketName, Key: res.preset.image };

    // s3.getObject(params)
    //     .promise()
    //     .then((result) => {
    //         // change this later
    //         const image = JSON.parse(result.image);

    //         transform(image, res.presets)
    //     })
    //     .catch((err) => res.json(err));
});

router.get('/', (req, res) => {
    // retrieves all images from S3
    console.log("⚡️ Received request to /images");
});

function getBufferFromBase64(url) {
    return Buffer.from(url.split(',')[1], 'base64');
}

function transform(image, presets) {
    // resize image
    let info = sharp(image).resize(presets.width, presets.height);

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
        edit = edit + ".png"
        info = info.png().toFile(edit);
    }
    // transcode jpeg
    if (presets.file == "jpeg") {
        edit = edit + ".jpeg"
        info = info.jpeg().toFile(edit);
    }

    console.log(info);
}

module.exports = router;