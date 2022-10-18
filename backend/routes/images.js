const axios = require('axios');
const express = require('express');
require('dotenv').config();

const router = express.Router();

router.post('/upload', (req, res) => {
    console.log("⚡️ Received request to /upload");
    res.send("Received image successfully.")
});

module.exports = router;