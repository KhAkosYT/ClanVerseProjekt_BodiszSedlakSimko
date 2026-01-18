import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-createclan',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './createclan.html',
  styleUrl: './createclan.css'
})

export class Createclan implements OnInit {
   clanname: string = "";
   gameId: number | null = null;
   gameName: string = "";
   description: string = "";
   showModal: boolean = false;
   games: any[] = [];
   gameSuggestions: any[] = [];

  constructor(private http: HttpClient) {}

  private token = localStorage.getItem('token');

  ngOnInit(): void {
    this.fetchGames();
  }

  fetchGames() {
    this.http.get('http://localhost:3000/api/games').subscribe({
      next: (data: any) => {
        this.games = data.games || [];
        this.gameSuggestions = [...this.games];
      },
      error: (err) => {
        console.error('Hiba a játékok lekérésekor:', err);
      }
    });
  }

  onGameInput(event: any) {
    const value = this.gameName.trim();
    if (!value) {
      this.gameSuggestions = this.games;
      this.gameId = null;
      return;
    }
    this.http.get(`http://localhost:3000/api/games?search=${encodeURIComponent(value)}`).subscribe({
      next: (data: any) => {
        this.gameSuggestions = Array.isArray(data.games) ? data.games : [];
      },
      error: (err) => {
        this.gameSuggestions = [];
        console.error('Hiba a játékok szűrésekor:', err);
      }
    });
  }

  selectGame(game: any) {
    this.gameName = game.name;
    this.gameId = game.id;
    this.gameSuggestions = [];
  }

  onGameFocus() {
    this.gameSuggestions = this.games;
  }

  goToLogin() {
    window.location.href = '/login';
  }

  onSubmit() {
    if(!this.token){
      this.showModal = true;
      return;
    }
    const createclanData = {clanName : this.clanname, gameId: this.gameId, description: this.description}
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    this.http.post('http://localhost:3000/api/clans', createclanData, { headers }).subscribe({
      next: (response: any) => {
        window.location.href = '/clans';
      },
      error: (error) => {
        console.error('Hiba a klán létrehozásánál:', error);
      }
    });
  }

}


