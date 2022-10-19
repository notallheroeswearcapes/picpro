const axios = require('axios');
const express = require('express');
const sharp = require("sharp");
require('dotenv').config();

const AWS = require('aws-sdk');

// Cloud Services Set0up
// Create unique bucket name
const bucketName = 'xxxxxxxxxxxx-change-later';
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

// s3.createBucket({ Bucket: bucketName })
//     .promise()
//     .then(() => console.log(`Created bucket: ${bucketName}`))
//     .catch((err) => {
//         if (err.statusCode !== 409) {
//             console.log(`Error creating bucket: ${err}`);
//         }
//     })

const router = express.Router();

router.post('/upload', (req, res) => {
    console.log("⚡️ Received request to /images/upload");
    let imgBuffer = getBufferFromBase64(req.body.url);
    sharp(imgBuffer)
        .metadata()
        .then(metadataResult => {
            console.log(metadataResult);
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