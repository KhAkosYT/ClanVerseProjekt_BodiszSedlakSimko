import { Injectable, signal } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = environment.apiUrl + '/users';

    constructor(private http: HttpClient) { }

    showAuthModal = signal(false);
    
    updateAuthStatus() {
        if (localStorage.getItem('token')) {
            this.showAuthModal.set(false);
        }
    }

    triggerAuthError() {
        this.showAuthModal.set(true);
    }

    register(userData: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, userData);
    }

    login(loginData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, loginData).pipe(
            tap(() => this.updateAuthStatus())
        );
    }

    logout(): Observable<any> {
        return this.http.post(`${this.apiUrl}/logout`,{});
    }

    getProfile(token: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/profile`, { headers: { 'Authorization': `Bearer ${token}`}})
    }

    updateProfile(userData: FormData, token: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/profile`, userData, { headers: { 'Authorization': `Bearer ${token}`}})
}
}