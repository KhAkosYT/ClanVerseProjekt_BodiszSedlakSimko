import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = environment.apiUrl + '/users';

    constructor(private http: HttpClient) { }

    register(userData: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, userData);
    }

    login(loginData: {username: string, password: string}): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, loginData);
    }

    logout(): Observable<any> {
        return this.http.post(`${this.apiUrl}/logout`,{});
    }

    // Lórinak ide jöhet a profile oldal http kérései
}