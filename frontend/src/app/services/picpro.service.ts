import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs';
import { Image } from '../models/image.interface';
import { Metadata } from '../models/metadata.interface';

@Injectable({
  providedIn: 'root'
})
export class PicproService {

  private isLoading$$ = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading$$.asObservable();

  uploadImageUrl = "/images/upload";
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
}
