import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  request(query:string ,token: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/query`, { query, token });
  }
  logout(): Observable<any> {
    return {} as Observable<any>;
    //return this.http.post(`${this.apiUrl}/logout`, {});
  }
}
