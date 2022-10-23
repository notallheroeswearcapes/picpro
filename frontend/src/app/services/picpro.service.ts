import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs';
import { Image } from '../models/image.interface';
import { Metadata } from '../models/metadata.interface';
import { Transformation } from '../models/transformation.interface';
import { Preset } from '../models/preset.interface';

@Injectable({
  providedIn: 'root'
})
export class PicproService {

  private isLoading$$ = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading$$.asObservable();

  getImagesUrl = "/images/";
  uploadImageUrl = "/images/upload";
  fetchImageUrl = "/images/fetch";
  transformImageUrl = "/images/transform";
  getPresetsUrl = "/presets/";
  fetchPresetUrl = "/presets/fetch";
  savePresetUrl = "/presets/save";
  httpPostOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  setLoading(isLoading: boolean) {
    this.isLoading$$.next(isLoading);
  }

  getAllPresets(): Observable<string[]> {
    return this.http.get<string[]>(this.getPresetsUrl);
  }

  fetchPreset(presetName: string): Observable<Preset> {
    return this.http.post<Preset>(this.fetchPresetUrl, { name: presetName }, this.httpPostOptions);
  }

  savePreset(preset: Preset): Observable<boolean> {
    return this.http.post<boolean>(this.savePresetUrl, preset, this.httpPostOptions);
  }

  uploadImage(image: Image): Observable<Metadata> {
    const formData = new FormData();
    formData.append('file', image.file!);
    formData.append('name', image.name);
    return this.http.post<Metadata>(this.uploadImageUrl, formData);
  }

  fetchImage(image: Image): Observable<Image> {
    return this.http.post<Image>(this.fetchImageUrl, { name: image.name }, this.httpPostOptions);
  }

  getAllImages(): Observable<string[]> {
    return this.http.get<string[]>(this.getImagesUrl);
  }

  transformImage(transformation: Transformation): Observable<Image> {
    return this.http.post<Image>(this.transformImageUrl, transformation, this.httpPostOptions);
  }
}
