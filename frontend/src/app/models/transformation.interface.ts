export interface Transformation {
    imageName?: string,
    outputType: string,
    width?: number,
    height?: number,
    rotationAngle?: number,
    brightness?: number,
    saturation?: number,
    hue?: number,
    flip: boolean,
    flop: boolean,
    sharpen: boolean,
    blur: boolean,
    greyscale: boolean,
    blackwhite: boolean,

}