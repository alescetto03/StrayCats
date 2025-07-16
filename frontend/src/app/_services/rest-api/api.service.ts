import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthRequest } from './auth-request.type';
import { Cat } from './cat.type';

const BASE_HOST = 'http://localhost:3000';

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

  getCatById(id: number) {
    const url = `${BASE_HOST}/cats/${id}`;
    return this.http.get<Cat>(url, this.httpOptions);
  }

  saveCat(cat: Cat) {
    const url = `${BASE_HOST}/cats`; 
    return this.http.post(url, cat, this.httpOptions);
  }
}
