import { Component, AfterViewInit } from '@angular/core';
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

export class Createclan implements AfterViewInit {
   clanname: string = "";
   gameId: number = -1;
   description: string = "";
   showModal: boolean = false;

  constructor(private http: HttpClient) {}

  private token = localStorage.getItem('token');

  ngAfterViewInit(): void {
    const gameInput = document.getElementById('game') as HTMLInputElement;
    const suggestions = document.createElement('ul');
    suggestions.id = 'game-suggestions';
    gameInput.parentNode!.insertBefore(suggestions, gameInput.nextSibling);
    let currentGames: any[] = [];

    gameInput.addEventListener('input', async (e) => {
      const game = (e.target as HTMLInputElement).value.trim();
      if (!game) {
        suggestions.style.display = 'none';
        suggestions.innerHTML = '';
        (document.getElementById('gameId') as HTMLInputElement).value = '';
        currentGames = [];
        return;
      }
      try {
        const response = await fetch(`http://localhost:3000/api/games?search=${encodeURIComponent(game)}`);
        const data = await response.json();
        const games = data.games || [];
        currentGames = games;
        suggestions.innerHTML = '';
        if (games.length > 0) {
          games.forEach((g: any) => {
            const li = document.createElement('li');
            li.textContent = g.name;
            li.style.cursor = 'pointer';
            li.style.padding = '4px';
            li.addEventListener('mousedown', () => {
              gameInput.value = g.name;
              (document.getElementById('gameId') as HTMLInputElement).value = g.id;
              suggestions.style.display = 'none';
              suggestions.innerHTML = '';
              currentGames = [];
            });
            suggestions.appendChild(li);
          });
          suggestions.style.display = 'block';
        } else {
          suggestions.style.display = 'none';
        }
      } catch (err) {
        console.error('Hiba történt a játékok lekérdezése során:', err);
      }
    });

    gameInput.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === 'Tab') && currentGames.length === 1) {
        e.preventDefault();
        gameInput.value = currentGames[0].name;
        (document.getElementById('gameId') as HTMLInputElement).value = currentGames[0].id;
        suggestions.style.display = 'none';
        suggestions.innerHTML = '';
        currentGames = [];
      }
    });
  }

  goToLogin() {
    window.location.href = '/login';
  }

  onSubmit() {
    if(!this.token){
      this.showModal = true;
      return;
    }
    const gameIdValue = parseInt((document.getElementById('gameId') as HTMLInputElement).value, 10);
    const createclanData = {clanName : this.clanname, gameId: gameIdValue, description: this.description}
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    this.http.post('http://localhost:3000/api/clans', createclanData, { headers }).subscribe({
      next: (response: any) => {
        console.log('Sikeres klán létrehozás:', response);
        window.location.href = '/clans';
      },
      error: (error) => {
        console.error('Hiba a klán létrehozásánál:', error);
      }
    });
  }

}


