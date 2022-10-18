// import dependencies
const sharp = require("sharp");
const fs = require("fs");

const image = "image/original.png";
const w = 400;
const h = 200;
const brightness = 2;
const saturation = 0.5;
const hue = 180;

(async function (input = image) {
    try {
        const B = true;
        let info;
        let edit = "image/edit"

        // resize image
        if (B) {
            info = await sharp(input).resize(w, h);
        }

        // greyscale
        if (!B) {
            info = await info.greyscale();
        }
        // black and white
        if (!B) {
            info = await info.threshold(100);
        }

        // brightness
        if (!B) {
            info = await info.modulate({
                brightness: brightness,
            });
        }
        // saturation
        if (!B) {
            info = await info.modulate({
                saturation: saturation,
            });
        }
        // hue
        if (B) {
            info = await info.modulate({
                hue: hue,
            });
        }

        // blur
        if (!B) {
            info = await info.blur(20);
        }

        // transcode png
        if (!B) {
            edit = edit + ".png"
            info = await info.png().toFile(edit);
        }
        // transcode webp
        if (!B) {
            edit = edit + ".webp"
            info = await info.webp().toFile(edit);
        }
        // transcode jpeg
        if (B) {
            edit = edit + ".jpeg"
            info = await info.jpeg().toFile(edit);
        }

        console.log(info);
    } catch (error) {
        console.log(error);
    }
})();