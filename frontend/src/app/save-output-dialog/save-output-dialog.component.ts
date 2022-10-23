import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Image } from "../models/image.interface";
import { PicproService } from "../services/picpro.service";
import { Buffer } from 'buffer';

@Component({
    selector: 'save-output-dialog',
    templateUrl: 'save-output-dialog.html',
})
export class SaveOutputDialog {
    constructor(
        public picproService: PicproService,
        @Inject(MAT_DIALOG_DATA) public outputImage: Image
    ) { }

    chosenImageName: string = this.outputImage.name;

    uploadImage() {
        this.outputImage.name = this.setCorrectFileName(this.outputImage, this.chosenImageName);
        this.outputImage.file = this.dataURItoFile();
        this.picproService.uploadImage(this.outputImage).subscribe(res => {
            console.log(res);
        });
    }

    downloadImage() {
        this.outputImage.name = this.setCorrectFileName(this.outputImage, this.chosenImageName);
        const link = document.createElement('a');
        link.setAttribute('target', '_self');
        link.setAttribute('href', this.outputImage.url!.toString());
        link.setAttribute('download', this.outputImage.name);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    setCorrectFileName(image: Image, suppliedName: string): string {
        if (!suppliedName.includes('.')) {
            return `${suppliedName}${this.extractImageTypeSuffix(image)}`;
        } else {
            return suppliedName;
        }
    }

    extractImageTypeSuffix(image: Image): string {
        return `.${image?.metadata?.format}`;
    }

    dataURItoFile() {
        const byteString = Buffer.from(this.outputImage.url!.toString().split(',')[1], 'base64');
        const blob = new Blob([byteString], {type: this.outputImage.metadata?.format});
        return new File([blob], this.outputImage.name);
    }
}