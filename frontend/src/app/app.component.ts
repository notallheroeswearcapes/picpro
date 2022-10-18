import { Component } from '@angular/core';
import { PicproService } from './services/picpro.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  fileName: string = '';
  inputImageUrl: any;
  outputImageUrl: any;
  fileReader: FileReader = new FileReader();

  constructor(public picproService: PicproService) { }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      this.fileReader.readAsDataURL(file);
      this.fileReader.onload = () => { 
        this.inputImageUrl = this.fileReader.result; 
        console.log(this.inputImageUrl);
      }
      console.log(file);
    }
  }

  triggerFileUpload(file: File) {
    this.picproService.uploadImage(file).subscribe(res => {
      console.log(res);
    });
  }
}