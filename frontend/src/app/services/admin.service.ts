import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = environment.apiUrl + '/admin';

    constructor(private http: HttpClient) { }

    getIsAdmin(token: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/is-admin`, { headers: { 'Authorization': `Bearer ${token}`}})
    }

    createGame(gameData: FormData, token: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/upload-game`, gameData, { headers:{ 'Authorization': `Bearer ${token}`}})
    }
    
}
