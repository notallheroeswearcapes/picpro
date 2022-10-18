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
  inputImage: Image | undefined;
  outputImage: Image | undefined;
  fileReader: FileReader = new FileReader();

  constructor(public picproService: PicproService) { }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileReader.readAsDataURL(file);
      this.fileReader.onload = () => { 
        this.inputImage = {
          name: file.name,
          content: file,
          url: this.fileReader.result
        };
        console.log(this.inputImage);
      };
    }
  }

  triggerImageUpload(image: Image) {
    this.picproService.uploadImage(image.content).subscribe(res => {
      console.log(res);
    });
  }
}