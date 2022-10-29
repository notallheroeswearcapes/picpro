import { Component } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Image } from './models/image.interface';
import { Preset } from './models/preset.interface';
import { Metadata } from './models/metadata.interface';
import { Transformation } from './models/transformation.interface';
import { SaveOutputDialog } from './save-output-dialog/save-output-dialog.component';
import { PicproService } from './services/picpro.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  uploaded: boolean = false;
  imageChosen: boolean = false;
  images: string[] = [];
  chosenImageName: string = '';
  inputImageName: string = '';
  inputImage?: Image;
  outputImage?: Image;
  fileReader: FileReader = new FileReader();
  mimeTypes: string[] = ["JPEG", "PNG", "WEBP", "GIF", "AVIF", "TIFF", "RAW"];
  transformation: Transformation = this.initializeTransformation();
  presets: string[] = [];
  chosenPreset: Preset = { name: '' };

  constructor(
    public picproService: PicproService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getAllImages();
    this.getAllPresets();
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
          file: file,
          url: this.fileReader.result
        };
      };
    }
  }

  onInputImageReset() {
    this.inputImage = undefined;
    this.inputImageName = '';
    this.chosenImageName = '';
    this.uploaded = false;
    this.imageChosen = false;
  }

  onOutputImageReset() {
    this.outputImage = undefined;
  }

  triggerImageRetrieval() {
    this.inputImage = {
      name: this.chosenImageName,
    };
    this.picproService.fetchImage(this.inputImage).subscribe(res => {
      this.inputImage!.metadata = res.metadata;
      this.inputImage!.url = res.url;
      this.imageChosen = true;
      this.transformation.imageName = this.chosenImageName;
      this.setTransformationFromMetadata(res.metadata!);
    });
  }

  triggerInputImageUpload() {
    if (this.inputImage) {
      this.inputImage.name = this.setCorrectFileName(this.inputImage, this.inputImageName);
      this.transformation.imageName = this.inputImage.name;
      this.picproService.uploadImage(this.inputImage).subscribe(res => {
        this.inputImage!.metadata = res;
        this.uploaded = true;
        this.getAllImages();
        this.setTransformationFromMetadata(res!);
      });
    }
  }

  triggerImageTransformation() {
    if (this.inputImage) {
      this.picproService.transformImage(this.transformation).subscribe(res => {
        this.outputImage = res;
      });
    }
  }

  useOutputImageAsInputImage() {
    this.getAllImages();
    this.inputImage = this.outputImage;
    this.outputImage = undefined;
    this.chosenImageName = '';
    this.uploaded = false;
    this.imageChosen = true;
    this.transformation = this.initializeTransformation();
    this.setTransformationFromMetadata(this.inputImage?.metadata!);
  }

  openSaveOutputDialog() {
    this.dialog.open(SaveOutputDialog, {
      data: this.outputImage
    });
  }

  getAllImages() {
    this.picproService.getAllImages().subscribe(res => {
      this.images = res;
    });
  }

  getAllPresets() {
    this.picproService.getAllPresets().subscribe(res => {
      this.presets = res;
    });
  }

  triggerPresetRetrieval() {
    this.picproService.fetchPreset(this.chosenPreset.name).subscribe(res => {
      this.chosenPreset = res;
      this.transformation = res.transformation!;
      this.transformation.imageName = this.inputImage?.name;
    });
  }

  triggerPresetUpload() {
    this.chosenPreset.transformation = this.transformation;
    this.chosenPreset.transformation.imageName = undefined;
    this.picproService.savePreset(this.chosenPreset).subscribe(res => {
      if (res) {
        this.getAllPresets();
      }
    });
  }

  setCorrectFileName(image: Image, suppliedName: string): string {
    if (!suppliedName.includes('.')) {
      return `${suppliedName}${this.extractImageTypeSuffix(image)}`;
    } else {
      return suppliedName;
    }
  }

  extractImageTypeSuffix(image: Image): string {
    return `.${image?.file?.type?.split('/')[1]}`;
  }


  setTransformationFromMetadata(metadata: Metadata) {
    this.transformation.outputType = metadata.format.toUpperCase();
    this.transformation.width = metadata.width;
    this.transformation.height = metadata.height;
  }

  resetTransformation() {
    this.transformation = this.initializeTransformation();
    if ((this.uploaded || this.imageChosen) && (this.inputImage && this.inputImage.metadata)) {
      this.setTransformationFromMetadata(this.inputImage.metadata);
    }
  }

  initializeTransformation() {
    return {
      outputType: '',
      flip: false,
      flop: false,
      sharpen: false,
      blur: false,
      greyscale: false,
      blackwhite: false
    };
  }
}