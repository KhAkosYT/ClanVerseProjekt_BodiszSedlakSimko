import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core'; 
// import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-clans',
  imports: [],  
  templateUrl: './clans.html',
  styleUrl: './clans.css'
})

export class Clans implements OnInit {  
  private token = localStorage.getItem('token');
  error: string | null = null;

  constructor(private http: HttpClient) {
    console.log('Clans component constructor called');
  }

  ngOnInit(): void {
    console.log('ngOnInit called in Clans component');
    if (this.token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`  
      });

      this.http.get('http://localhost:3000/api/clans', { headers }).subscribe({
        next: (datas) => {
          const innerClansData = datas as any; // Objektum, ami listát tartalmaz
          const clansData = innerClansData.clans;
          console.log('Clans data received:', datas);
          

          const clansContainer = document.querySelector('.clans-container');
          if (clansContainer) {
            for (const clan of clansData) {
              const cardDiv = document.createElement('div');
              cardDiv.setAttribute('class', 'card');
              cardDiv.setAttribute('style', 'width: 18rem;');
              cardDiv.innerHTML = `
                <div class="card-body">
                  <h5 class="card-title">${clan.name}</h5>
                  <h6 class="card-subtitle mb-2 text-body-secondary">${clan.game}</h6>
                  <a class="card-link" id="openClan">Részletek</a>
                </div>
                `;
                const openClanLink = cardDiv.querySelector('#openClan');
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
          const clanData = innerClanData.clan;
          const allMembers = innerClanData.allMembers;

          const clanDetailsContainer = document.querySelector('.clan-details-container');
          if (clanDetailsContainer) {
            console.log(innerClanData)
            
            clanDetailsContainer.innerHTML = `
                  <div class="card-body">
                    <h5 class="card-title">${clanData.name}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">${clanData.game}</h6>
                    <p class="card-text">${clanData.description}</p>
                    <div class="members">
                      <!-- ide jönnek a tagok -->
                    </div>
                    <div class="buttons">
                      
                    </div>
                  </div>
            `;
            const membersDiv = document.querySelector('.members');
            if(membersDiv){
              for(const member of allMembers){
                const p = document.createElement('p');
                p.innerHTML = `${member}`;
                membersDiv.appendChild(p);
              }
            }

            const buttonDiv = document.querySelector('.buttons');
            if(buttonDiv) {
              if(innerClanData.editable){
                buttonDiv.innerHTML = `
                  <button (click)="updateClan(id)">Klán módosítása</button>
                  <button (click)="deleteClan(id)">Klán törlése</button>
                  <button (click)="leaveClan(id)">Kilépés a klánból</button>
                `;
              }
              if(innerClanData.canJoin === false){
                buttonDiv.innerHTML = `
                  <button (click)="leaveClan(id)">Kilépés a klánból</button>
                `;
              }
              if(innerClanData.canJoin === true){
                buttonDiv.innerHTML = `
                  <button (click)="joinClan(id)">Belépés a klánba</button>
                `;
              }
            }
            

            
          }
        },
        error: (err) => {
          console.error('Hiba a klán részletek lekérésekor:', err);
          
        }
      });
    }
  }

  

}