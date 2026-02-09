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
          const innerClanData = data as any; // Objektum, ami listát tartalmaz
          const clan = innerClanData.clanData;
          const allMembers = clan.allMembers;

          const clanDetailsContainer = document.querySelector('.clan-details-container');
          if (clanDetailsContainer) {
            console.log(innerClanData)
            
            clanDetailsContainer.innerHTML = `
                  <div class="card-body">
                    <h5 class="card-title">${clan.name}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary" style=" color: #00f3ff !important;">${clan.gameName}</h6>
                    <p class="card-text">${clan.description}</p>
                    <div class="members">
                      <!-- ide jönnek a tagok -->
                    </div>
                    <div class="buttons">
                      
                    </div>
                  </div>
            `;
            const membersDiv = document.querySelector('.members');
            if (membersDiv) {
              for (const member of allMembers) {
                const p = document.createElement('p');
                p.innerHTML = `Név: ${member.name} Szerep: ${member.role}`;
                membersDiv.appendChild(p);
              }
            }

            const buttonDiv = document.querySelector('.buttons');
            if(buttonDiv) {
              buttonDiv.innerHTML = ''; 
              if(innerClanData.editable){
                const updateBtn = document.createElement('button');
                updateBtn.textContent = 'Klán módosítása';
                updateBtn.addEventListener('click', () => this.openEditModal(clan));
                buttonDiv.appendChild(updateBtn);

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Klán törlése';
                deleteBtn.addEventListener('click', () => this.deleteClan(clanId));
                buttonDiv.appendChild(deleteBtn);

                const leaveBtn = document.createElement('button');
                leaveBtn.textContent = 'Kilépés a klánból';
                leaveBtn.addEventListener('click', () => this.leaveClan(clanId));
                buttonDiv.appendChild(leaveBtn);
              }
              if(innerClanData.canJoin === false){
                const leaveBtn = document.createElement('button');
                leaveBtn.textContent = 'Kilépés a klánból';
                leaveBtn.addEventListener('click', () => this.leaveClan(clanId));
                buttonDiv.appendChild(leaveBtn);
              }
              if(innerClanData.canJoin === true){
                const joinBtn = document.createElement('button');
                joinBtn.textContent = 'Belépés a klánba';
                joinBtn.addEventListener('click', () => this.onJoin(clanId));
                buttonDiv.appendChild(joinBtn);
              }

              const messageButton = document.createElement('button');
              messageButton.textContent = 'Chat megnyitása';
              messageButton.addEventListener('click', () => this.openMessage(clan.id));
              buttonDiv.appendChild(messageButton);
            }
            

            
          }
        },
        error: (err) => {
          console.error('Hiba a klán részletek lekérésekor:', err);
          
        }
      });
    }
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