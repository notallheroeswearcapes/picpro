import { Component } from '@angular/core';
import { Image } from './models/image.interface';
import { PicproService } from './services/picpro.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'frontend';
  uploaded: boolean = false;
  inputImageName: string = '';
  inputImage?: Image;
  outputImage?: Image;
  fileReader: FileReader = new FileReader();

  constructor(public picproService: PicproService) { }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.uploaded = false;
      this.fileReader.readAsDataURL(file);
      this.fileReader.onload = () => {
        this.inputImageName = file.name;
        this.inputImage = {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          url: this.fileReader.result
        };
        console.log(this.inputImage);
      };
    }
  }

  onInputImageReset() {
    this.inputImage = undefined;
    this.inputImageName = '';
    this.uploaded = false;
  }

  triggerImageUpload(image: Image) {
    this.picproService.uploadImage(image).subscribe(res => {
      // trigger upload to S3, retrieve metadata from image to display to user
      if (this.inputImage) {
        this.inputImage.name = this.inputImageName;
        this.inputImage.metadata = res;
        this.uploaded = true;
      }
    });
  }
}