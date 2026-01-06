import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
// import { RouterLink } from "@angular/router";

interface Member {
  name: string;
  role: string;
}

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
                  <h6 class="card-subtitle mb-2 text-body-secondary">${clan.game.gameName}</h6>
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
          const clan = innerClanData.clanData;
          const allMembers = innerClanData.allClanMembers;

          const clanDetailsContainer = document.querySelector('.clan-details-container');
          if (clanDetailsContainer) {
            console.log(innerClanData)
            
            clanDetailsContainer.innerHTML = `
                  <div class="card-body">
                    <h5 class="card-title">${clan.name}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">${clan.gameName}</h6>
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
              // Az allMembers objektum értékeit tömbbe alakítjuk, hogy iterálható legyen
              const membersArray = Object.values(allMembers) as Member[];
              for (const member of membersArray) {
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
                updateBtn.addEventListener('click', () => this.updateClan(clanId));
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
            }
            

            
          }
        },
        error: (err) => {
          console.error('Hiba a klán részletek lekérésekor:', err);
          
        }
      });
    }
  }

  




  updateClan(clanId: string): void {

    console.log('Klán adatainak frissítése:', clanId);
  }

  deleteClan(clanId: string): void {

    console.log('Klán törlése:', clanId);
  }

  leaveClan(clanId: string): void {

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
      })
    }
  }





  

}