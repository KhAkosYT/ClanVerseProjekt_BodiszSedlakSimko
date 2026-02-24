import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class MessageService{
    private apiUrl = environment.apiUrl;
    constructor(private http: HttpClient){}

    getMessage(token: string, clanId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/messages/${clanId}`, { headers: { 'Authorization' : `Bearer ${token}` }});
    }

    createMessage(token: string, clanId: string, message: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/messages/${clanId}`, { message }, { headers: { 'Authorization' : `Bearer ${token}` }});
    }


}