import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Member {
  name: string;
  role: string;
}

@Component({
  selector: 'app-clans',
  imports: [CommonModule, FormsModule],
  templateUrl: './clans.html',
  styleUrl: './clans.css',
  encapsulation: ViewEncapsulation.None
})

export class Clans implements OnInit {
  private token = localStorage.getItem('token');
  error: string | null = null;
  games: any[] = [];
  editGameId: number | null = null;
  showEditModal: boolean = false;
  editClanName: string = '';
  editDescription: string = '';
  editGameName: string = '';
  editGameSuggestions: any[] = [];
  editingClanId: string | null = null;
  clanData: any = null;
  isKickMode: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
    console.log('Clans component constructor called');
  }

  ngOnInit(): void {
    if (this.token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`  
      });

      this.http.get('http://localhost:3000/api/clans', { headers }).subscribe({
        next: (datas) => {
          const clansData = datas as any[];
          //console.log('Clans data received:', datas);
          

          const clansContainer = document.querySelector('.clans-container');
          if (clansContainer) {
            for (const clan of clansData) {
              const cardDiv = document.createElement('div');
              cardDiv.classList.add('card', 'clan-card-background');
              cardDiv.setAttribute('style', 'width: 18rem; cursor: pointer;');
              cardDiv.innerHTML = `
                <div class="card-body">
                  <h5 class="card-title" style="color: #E0F7FA;">${clan.name}</h5>
                  <h6 class="card-subtitle mb-2 text-body-secondary" style="color: #00f3ff !important;">${clan.gameName}</h6>
                  <a class="card-link open-clan-link" style="color: white; text-decoration: none;">Részletek</a>
                </div>
                `;
                const openClanLink = cardDiv.querySelector('.open-clan-link');
              if (openClanLink){
                openClanLink.addEventListener('click', () => this.fetchClanDetails(clan.id));
              }
              clansContainer.appendChild(cardDiv);
            }
          };

          //document.body.appendChild(buttonDiv);
        },
        error: (err) => {
          this.error = 'Hiba történt a kérés során: ' + err.message;
          console.error('Hiba:', err);  
        }
      });
    } else {
      this.error = 'Nincs token a localStorage-ban.';
    }
  }


  fetchClanDetails(clanId: string): void {
    
    if (this.token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`  
      });
    
      this.http.get(`http://localhost:3000/api/clans/${clanId}`, { headers }).subscribe({
        next: (data) => {
          const responseData = data as any;
          this.clanData = {
            ...responseData.clanData,
            editable: responseData.editable,
            canJoin: responseData.canJoin
          };
          this.isKickMode = false; 
        },
        error: (err) => {
          console.error('Hiba a klán részletek lekérésekor:', err);
          this.clanData = null;
        }
      });
    }
  }

  closeClanDetails(): void {
    this.clanData = null;
    this.isKickMode = false;
  }

  openEditModal(clan: any) {
    console.log('Szerkesztendő klán adatai:', clan);
    this.editClanName = clan.name;
    this.editDescription = clan.description;
    this.editGameId = clan.gameId;
    this.editGameName = clan.gameName;
    this.editingClanId = clan.id;
    this.showEditModal = true;
    this.fetchGames();
  }

  fetchGames() {
    this.http.get('http://localhost:3000/api/games').subscribe({
      next: (data: any) => {
        this.games = data.games || [];
        this.editGameSuggestions = this.games;
      },
      error: (err) => {
        console.error('Hiba a játékok lekérésekor:', err);
      }
    });
  }

  deleteClan(clanId: string): void {
    if(this.token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });

      this.http.delete(`http://localhost:3000/api/clans/${clanId}`, { headers }).subscribe({
        next: (response: any) => {
          console.log(response.message);
          window.location.reload();

        },
        error: (error) => {console.error("Hiba a klán törlésekor.")}
      });
    }

    console.log('Klán törlése:', clanId);
  }

  openKickPlayer(clan: any) : void {
    this.isKickMode = !this.isKickMode;
  }

  kickMember(memberName: string, clanId: string): void {
    if(!memberName || !clanId) return;
    
    if(this.token){
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });

      this.http.post(`http://localhost:3000/api/clans/${clanId}/kick/${memberName}`, {}, {headers}).subscribe({
        next: ( response: any ) => {
          alert(`Sikeresen kirúgtad ${memberName} nevű játékost!`);
          window.location.reload();
        },
        error: (error) => {
          alert("Hiba");
        }
      })
    }


    

  }

  leaveClan(clanId: string): void {
    if(this.token) {
      const headers = new HttpHeaders ({
        'Authorization': `Bearer ${this.token}`
      });

      this.http.post(`http://localhost:3000/api/clans/${clanId}/leave`, {}, { headers }).subscribe({
        next: (response: any) =>  {
          console.log(response.message);
          window.location.reload();
        },
        error: (error) => {console.error("Hiba a klán kilépésekor.")}
      });
    }

    console.log('Kilépés a klánból:', clanId);
  }

  onJoin(clanid: string): void{
    if(this.token) {
      const headers = new HttpHeaders ({
        'Authorization': `Bearer ${this.token}`
      });


      this.http.post(`http://localhost:3000/api/clans/${clanid}/join`, {}, { headers }).subscribe({
        next: (response: any) => {
          console.log(response.message);
          window.location.reload(); 
        },
        error: (error) => {console.error("Hiba a klánba lépéskor.")}
      });
    }
  }
  openMessage(clanid: string): void{
    this.router.navigate(['/message', clanid]);
  }

  onEditGameInput(event: any) {
    const value = this.editGameName.trim();
    if (!value) {
      this.editGameSuggestions = this.games;
      this.editGameId = null;
      return;
    }
    this.http.get(`http://localhost:3000/api/games?search=${encodeURIComponent(value)}`).subscribe({
      next: (data: any) => {
        this.editGameSuggestions = Array.isArray(data.games) ? data.games : [];
      },
      error: (err) => {
        this.editGameSuggestions = [];
        console.error('Hiba a játékok szűrésekor:', err);
      }
    });
  }

  onEditGameChange(event: any) {
    const value = event.target.value.trim();
    if (!value) {
      this.editGameSuggestions = [];
      this.editGameId = null;
      return;
    }
    this.http.get(`http://localhost:3000/api/games?search=${encodeURIComponent(value)}`).subscribe({
      next: (data: any) => {
        this.editGameSuggestions = Array.isArray(data.games) ? data.games : [];
      },
      error: (err) => {
        this.editGameSuggestions = [];
        console.error('Hiba a játékok szűrésekor (change event):', err);
      }
    });
  }

  selectEditGame(game: any) {
    this.editGameName = game.name;
    this.editGameId = game.id;
    this.editGameSuggestions = [];
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editClanName = '';
    this.editDescription = '';
    this.editGameName = '';
    this.editGameId = null;
    this.editGameSuggestions = [];
  }

  onEditClanSubmit() {
    if (!this.editGameId && this.editGameName) {
      const matchedGame = this.games.find(game => game.name.toLowerCase() === this.editGameName.toLowerCase());
      if (matchedGame) {
        this.editGameId = matchedGame.id;
      }
    }

    if (!this.editClanName || !this.editGameId || !this.editDescription) {
      console.error('Hiányzó adatok a mentéshez:', { name: this.editClanName, gameId: this.editGameId, description: this.editDescription });
      return;
    }
    if (this.token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });
      const updateData = {
        newClanName: this.editClanName,
        newClanGame: this.editGameId,
        newClanDescription: this.editDescription
      };

      this.http.put(`http://localhost:3000/api/clans/${this.editingClanId}`, updateData, { headers }).subscribe({
        next: (response: any) => {
          this.closeEditModal();
          window.location.reload();
        },
        error: (error) => {
          console.error('Hiba a klán módosításánál:', error);
        }
      });
    }
  }

}