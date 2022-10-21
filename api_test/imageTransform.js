// import dependencies
const sharp = require("sharp");
const fs = require("fs");

(async function () {
    try {
        let edit = "image/edit"

        var dummy = {
                image: "image/original.png",
                width: 400,
                height: 200,
                greyscale: false,
                blackwhite: false,
                brightness: true,
                bri_set: 2,
                saturation: false,
                sat_set: 0.2,
                hue: false,
                hue_set: 180,
                blur: false,
                file: "jpeg"
        }

        // resize image
        let info = await sharp(dummy.image).resize(dummy.width, dummy.height);

        // greyscale
        if (dummy.greyscale) {
            info = await info.greyscale();
        }
        // black and white
        if (dummy.blackwhite) {
            info = await info.threshold(100);
        }

        // brightness
        if (dummy.brightness) {
            info = await info.modulate({
                brightness: dummy.bri_set,
            });
        }
        // saturation
        if (dummy.saturation) {
            info = await info.modulate({
                saturation: dummy.sat_set,
            });
        }
        // hue
        if (dummy.hue) {
            info = await info.modulate({
                hue: dummy.hue_set,
            });
        }

        // blur
        if (dummy.blur) {
            info = await info.blur(15);
        }

        // transcode png
        if (dummy.file == "png") {
            edit = edit + ".png"
            info = await info.png().toFile(edit);
        }
        // transcode jpeg
        if (dummy.file == "jpeg") {
            edit = edit + ".jpeg"
            info = await info.jpeg().toFile(edit);
        }

        console.log(info);
    } catch (error) {
        console.log(error);
    }
})();