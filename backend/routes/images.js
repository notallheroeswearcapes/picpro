const axios = require('axios');
const express = require('express');
const sharp = require("sharp");
require('dotenv').config();
const AWS = require('aws-sdk');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }).single('file');
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
            console.error(`❌ Error during image retrieval of file \'${fileName}\' from S3: ${error}`);
        });
});

router.post('/transform', (req, res) => {
    // main endpoint for image transformation, use sharp here
    console.log("⚡️ Received request to /images/transform");
    console.log(req.body);
    const inputImageName = req.body.imageName;
    const params = { Bucket: s3BucketName, Key: inputImageName };
    s3.getObject(params).promise()
        .then(data => {
            const imgBuffer = data.Body;
            transform(imgBuffer, req.body)
                .then(outputImgBuffer => {
                    const url = getDataUrlFromBuffer(outputImgBuffer);
                    const fileNameParts = inputImageName.split('.');
                    const outputImageName = fileNameParts[0] + '_transformed.' + fileNameParts[1];
                    sharp(outputImgBuffer).metadata()
                        .then(outputMetadata => {
                            res.send({
                                name: outputImageName,
                                url: url,
                                metadata: outputMetadata
                            });
                        })
                        .catch(metadataError => {
                            console.error(`❌ Error during image analysis for metadata: ${metadataError}`);
                            res.status(500).send(metadataError);
                        });
                })
                .catch(transformationError => {
                    console.error(`❌ Error during image transformation: ${transformationError}`);
                    res.status(500).send(transformationError);
                });
        })
        .catch(retrievalError => {
            console.error(`❌ Error during image retrieval of file \'${inputImageName}\' from S3: ${retrievalError}`);
            res.status(500).send(retrievalError);
        });

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

function transform(imgBuffer, transformation) {
    // resize image
    let transformationPipeline = sharp(imgBuffer).resize(transformation.width, transformation.height);

    // greyscale
    if (transformation.greyscale) {
        transformationPipeline.greyscale();
    }

    // black and white
    if (transformation.blackwhite) {
        transformationPipeline.threshold(100);
    }

    // brightness
    if (transformation.brightness) {
        transformationPipeline.modulate({
            brightness: transformation.brightness,
        });
    }

    // saturation
    if (transformation.saturation) {
        transformationPipeline.modulate({
            saturation: transformation.saturation,
        });
    }

    // hue
    if (transformation.hue) {
        transformationPipeline.modulate({
            hue: transformation.hue,
        });
    }

    // blur
    if (transformation.blur) {
        transformationPipeline.blur(transformation.blur);
    }

    if (transformation.rotationAngle) {
        transformationPipeline.rotate(transformation.rotationAngle);
    }

    if (transformation.flip) {
        transformationPipeline.flip();
    }

    if (transformation.flop) {
        transformationPipeline.flop();
    }

    if (transformation.sharpen) {
        transformationPipeline.sharpen();
    }

    if (transformation.outputType) {
        transformationPipeline.toFormat(transformation.outputType);
    }

    return transformationPipeline.toBuffer();
}

function getDataUrlFromBuffer(imgBuffer, mimeType) {
    const base64 = Buffer.from(imgBuffer).toString('base64');
    return `data:image/${mimeType};base64,${base64}`;
}

module.exports = router;