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

          //document.body.appendChild(cardBodyDiv);
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
    
      console.log(typeof clanId);
      console.log('Fetching details for clan ID:', clanId);

      this.http.get(`http://localhost:3000/api/clans/${clanId}`, { headers }).subscribe({
        next: (data) => {
          console.log('Clan details received:', data);
          const innerClanData = data as any; // Objektum, ami listát tartalmaz
          const clanData = innerClanData.clan;

          const clanDetailsContainer = document.querySelector('.clan-details-container');
          if (clanDetailsContainer) {
            clanDetailsContainer.innerHTML = `
                  <div class="card-body">
                    <h5 class="card-title">${clanData.name}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">${clanData.game}</h6>
                    <p class="card-text">${clanData.description}</p>
                    <div class="members">
                      <!-- ide jönnek a tagok -->
                    </div>
                    <a class="card-link" id="openClan">belepes</a>
                  </div>
            `;


            if(innerClanData.editable){
              const cardBodyDiv = document.querySelector('.card-body');
              // Ide kell írni majd a 2 gombot (torles, szerkesztes)
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