import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private apiUrl = environment.apiUrl;

    private selectedGameIds = new BehaviorSubject<number[]>([]);
    selectedGameIds$ = this.selectedGameIds.asObservable();

    constructor(private http:HttpClient) { }

    getGames(search?: string): Observable<any> {
        const params: any = {};
        if (search) {
            params.search = search;
        }
        return this.http.get(`${this.apiUrl}/games`,  { params });
    }

    uploadGame(gameData: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/admin/upload-game`, gameData);
    }

    getFamousGames(): Observable<any> {
        return this.http.get(`${this.apiUrl}/famous-games`);
    }

    updateSelectedGames(gameIds: number[]) {
        this.selectedGameIds.next(gameIds);
    }
}
