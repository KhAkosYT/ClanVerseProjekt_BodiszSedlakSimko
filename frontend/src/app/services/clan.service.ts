import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClanService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createClan(clanData: { clanName: string, gameId: string, description: string }, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/clans`, clanData, { headers: { 'Authorization': `Bearer ${token}` } });
  }

  getClans(gameId?: string): Observable<any> {
    const params: any = {};
    if (gameId) {
      params.game = gameId;
    }
    return this.http.get(`${this.apiUrl}/clans`, { params });
  }

  getClan(id: string, token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/clans/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
  }

  deleteClan(id: string, token: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clans/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
  }

  updateClan(id: string, clanData: any, token: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/clans/${id}`, clanData, { headers: { 'Authorization': `Bearer ${token}` } });
  }

  joinClan(id: string, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/clans/${id}/join`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
  }

  leaveClan(id: string, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/clans/${id}/leave`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
  }

  kickMember(clanId: string, memberName: string, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/clans/${clanId}/kick/${memberName}`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
  }


  // Ide jön Lóri népszerű klánok kérése
}