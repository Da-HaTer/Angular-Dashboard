import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  public token$ = this.tokenSubject.asObservable();
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.tokenSubject.next(response.token);
        })
      );
  }


  request(query:string ,token: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/query`, { query, token });
  }

  logout(): void {
    console.log("Loggin out")
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    console.log("authenticated:",this.isAuthenticated())
  }

  isAuthenticated(): boolean {
    console.log("isAuthenticated",!!this.tokenSubject.value);
    return !!this.tokenSubject.value;
  }
}
