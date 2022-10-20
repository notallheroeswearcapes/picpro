import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs';
import { Image } from '../models/image.interface';
import { Metadata } from '../models/metadata.interface';
import { UploadedImageResponse } from '../models/uploaded.image.response.interface';

@Injectable({
  providedIn: 'root'
})
export class PicproService {

  private isLoading$$ = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading$$.asObservable();

  getImagesUrl = "/images";
  uploadImageUrl = "/images/upload";
  fetchImageUrl = "/images/fetch";
  presetsTestUrl = "/presets/test";
  httpPostOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  setLoading(isLoading: boolean) {
    this.isLoading$$.next(isLoading);
  }

  sendPresetsTestRequest(): Observable<string> {
    return this.http.get(this.presetsTestUrl, { responseType: 'text' });
  }

  uploadImage(image: Image): Observable<Metadata> {
    return this.http.post<Metadata>(this.uploadImageUrl, image, this.httpPostOptions);
  }

  fetchImage(image: Image): Observable<UploadedImageResponse> {
    return this.http.post<UploadedImageResponse>(this.fetchImageUrl, image, this.httpPostOptions);
  }

  getAllImages(): Observable<string[]> {
    return this.http.get<string[]>(this.getImagesUrl);
  }
}
