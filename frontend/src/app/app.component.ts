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
  images: string[] = [];
  chosenImageName: string = '';
  inputImageName: string = '';
  inputImage?: Image;
  outputImage?: Image;
  fileReader: FileReader = new FileReader();

  constructor(public picproService: PicproService) { }

  ngOnInit() {
    this.picproService.getAllImages().subscribe(res => {
      this.images = res;
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.uploaded = false;
      this.fileReader.readAsDataURL(file);
      this.fileReader.onload = () => {
        this.inputImageName = file.name;
        this.inputImage = {
          name: file.name,
          new: true,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          url: this.fileReader.result
        };
      };
    }
  }

  onInputImageReset() {
    this.inputImage = undefined;
    this.inputImageName = '';
    this.uploaded = false;
  }

  triggerImageRetrieval() {
    this.inputImage = {
      name: this.chosenImageName,
      new: false
    };
    this.picproService.fetchImage(this.inputImage).subscribe(res => {
      this.inputImage!.metadata = res.metadata;
      this.inputImage!.url = res.url;
    });
  }

  triggerInputImageUpload() {
    if (this.inputImage) {
      this.inputImage.name = this.setCorrectFileName(this.inputImage, this.inputImageName);
      this.picproService.uploadImage(this.inputImage).subscribe(res => {
        // trigger upload to S3, retrieve metadata from image to display to user
        this.inputImage!.metadata = res;
        this.uploaded = true;
      });
    }
  }

  setCorrectFileName(image: Image, suppliedName: string): string {
    if (!suppliedName.includes('.')) {
      return `${suppliedName}${this.extractImageTypeSuffix(image)}`;
    } else {
      return suppliedName;
    }
  }

  extractImageTypeSuffix(image: Image): string {
    return `.${image?.type?.split('/')[1]}`;
  }
}