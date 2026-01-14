import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthRequest } from './auth-request.type';
import { Cat } from './cat.type';
import { firstValueFrom } from 'rxjs';
import { Comment } from './comment.type';

export const BASE_HOST = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  login(loginRequest: AuthRequest) {
    const url = `${BASE_HOST}/login`;
    return this.http.post<string>(url, loginRequest, this.httpOptions);
  }

  signup(signupRequest: AuthRequest) {
    const url = `${BASE_HOST}/signup`;
    return this.http.post(url, signupRequest, this.httpOptions);
  }

  getCats() {
    const url = `${BASE_HOST}/cats`;
    return this.http.get<Cat[]>(url, this.httpOptions);
  }

  getCatById(id: bigint) {
    const url = `${BASE_HOST}/cats/${id}`;
    return this.http.get<Cat>(url, this.httpOptions);
  }

  saveCat(cat: Cat) {
    const url = `${BASE_HOST}/cats`;
    return this.http.post<Cat>(url, cat, this.httpOptions);
  }

  uploadCatImage(data: FormData, catId: bigint) {
    const url = `${BASE_HOST}/cats/${catId}/image`;
    return this.http.post(url, data, { responseType: 'text' });
  }

  async saveComment(text: string, catId: bigint) {
      const url = `${BASE_HOST}/cats/${catId}/comments`;
      return await firstValueFrom(this.http.post<Comment>(url, {text: text}, this.httpOptions))
  }

  getComments(catId: bigint) {
      const url = `${BASE_HOST}/cats/${catId}/comments`;
      console.log(url)
      return this.http.get<Comment[]>(url, this.httpOptions);
  }
}
