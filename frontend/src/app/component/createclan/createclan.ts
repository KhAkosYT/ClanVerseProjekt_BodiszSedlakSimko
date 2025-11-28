import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-createclan',
  imports: [RouterLink, FormsModule],
  templateUrl: './createclan.html',
  styleUrl: './createclan.css'
})

export class Createclan {
   clanname: string = "";
   gamename: string = "";
   description: string = "";

  constructor(private http: HttpClient) {}

  private token= localStorage.getItem('token');

  onSubmit() {
    const createclanData = {clanName : this.clanname, game: this.gamename, description: this.description}
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


