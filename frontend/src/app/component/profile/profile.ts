import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private token = localStorage.getItem("token");

  username: string = "";
  email: string = "";
  current_password: string ="";
  new_password: string ="";
  confirm_new_password: string ="";

  constructor(private http: HttpClient){
    console.log("Profil component")
  }

  ngOnInit(): void {
    if(this.token){
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });

      this.http.get('http://localhost:3000/api/users/profile', {headers}).subscribe({
        next: (datas) => {
          const userDatas = datas as any;

          this.username = userDatas.userName;
          this.email = userDatas.email;
        },
        error:(error) => {
          console.error("Hiba a profil adatainak lekérdezése során", error);
        }
      })
    }
  }


  updateProfile(): void{
    if(this.token){
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });

      if(this.new_password != this.confirm_new_password){
        alert("Nem egyezik az új jelszó a megerősítő jelszóval");
      }

      const updateData = {newUserName: this.username, newEmail:this.email,currPass:this.current_password, newPass:this.new_password}
      this.http.put('http://localhost:3000/api/users/profile', updateData, {headers}).subscribe({
        next: (data) => {
          alert("Sikeresen frissítetted a profilodat!");
          console.log(data);
          window.location.reload();
        },
        error:(error)=> {
          console.error("Hiba a profil frissítése során", error);
        }
      })
    }
  }

}
