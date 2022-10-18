import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PicproService {

  private isLoading$$ = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading$$.asObservable();

  uploadImageUrl = "/images/upload";
  presetsTestUrl = "/presets/test";

  constructor(private http: HttpClient) { }

  setLoading(isLoading: boolean) {
    this.isLoading$$.next(isLoading);
  }

  sendPresetsTestRequest(): Observable<string> {
    return this.http.get(this.presetsTestUrl, { responseType: 'text' });
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append("image", file);
    return this.http.post(this.uploadImageUrl, formData, { responseType: 'text' });
  }
}
