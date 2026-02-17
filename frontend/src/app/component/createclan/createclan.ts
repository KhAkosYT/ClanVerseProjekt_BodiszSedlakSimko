import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { ClanService } from '../../services/clan.service'; 
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-createclan',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './createclan.html',
  styleUrl: './createclan.css'
})

export class Createclan implements OnInit {
   clanname: string = "";
   gameId: string | null = null;
   gameName: string = "";
   description: string = "";
   showModal: boolean = false;
   games: any[] = [];
   gameSuggestions: any[] = [];

  constructor(private clanService: ClanService, private gameService: GameService, private router: Router) {}

  ngOnInit(): void {
    this.fetchGames();
  }

  fetchGames() {
    this.gameService.getGames().subscribe({
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
    this.gameService.getGames(value).subscribe({
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
    this.router.navigate(['/login']);
  }

  onSubmit() {
    const token = localStorage.getItem('token');
    if(!token){
      this.showModal = true;
      return;
    }

    if(!this.clanname || this.gameId === null){
      alert("Kérlek töltsd ki a klán nevét és válassz egy játékot!")
      return;
    }

    const createclanData = {clanName : this.clanname, gameId: this.gameId, description: this.description}

    this.clanService.createClan(createclanData, token).subscribe({
      next: (response: any) => {
        this.router.navigate(['/clans']);
      },
      error: (error) => {
        console.error('Hiba a klán létrehozásánál:', error);
      }
    });
  }

}
