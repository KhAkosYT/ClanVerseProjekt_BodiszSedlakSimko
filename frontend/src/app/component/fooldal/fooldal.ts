import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GameService } from '../../services/game.service';
import { ClanService } from '../../services/clan.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-fooldal',
  templateUrl: './fooldal.html',
  styleUrl: './fooldal.css',
  encapsulation: ViewEncapsulation.None
})

export class Fooldal implements OnInit {
  constructor(private clanService: ClanService, private gameService: GameService) {}

  private serverUploadUrl = environment.serverUploadUrl;

  ngOnInit(): void { 
    this.fetchFamousGames();
    this.fetchFamousClans();
  }

  fetchFamousGames() {
    this.gameService.getFamousGames().subscribe({
      next: (response) => {
        const gamesData = response as any;
        console.log("Lefut a kérés");
        const nepszeruJatekokDiv = document.querySelector('.nepszeru-jatekok');
        if(nepszeruJatekokDiv){
          console.log("Belép az if ágba");
          for( const game of gamesData.games){
            console.log(game);
            const gameItemDiv = document.createElement('div');
            gameItemDiv.setAttribute('class', 'game-item');
            gameItemDiv.innerHTML = `
              <img src="${this.serverUploadUrl}${game.logo}" alt="${game.gameName}">
              <div class="game-item-details">
                <p>${game.gameName}</p>
                <p>Klánok száma: ${game.totalGameCount}</p>
              </div>
            `;
            nepszeruJatekokDiv.appendChild(gameItemDiv);
          }
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  fetchFamousClans() {
    this.clanService.getFamousClans().subscribe({
      next: (response) => {
        const clansData = response as any;
        console.log(clansData);

        const nepszeruKlanokDiv = document.querySelector('.nepszeru-klanok');
        if(nepszeruKlanokDiv){
          for( const clan of clansData.clans){
            const clanItemDiv = document.createElement('div');
            clanItemDiv.setAttribute('class', 'clan-item');
            clanItemDiv.innerHTML = `
              <h2>${clan.clanName}</h2>
              <div class="clan-item-details">
                <h4>${clan.gameName} <img src="${this.serverUploadUrl}${clan.gameLogo}" alt="${clan.gameName}"></h4>
                <p>Tagok: ${clan.currentClanMembersCount}</p>
              </div>
            `;
            nepszeruKlanokDiv.appendChild(clanItemDiv);
          }
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
