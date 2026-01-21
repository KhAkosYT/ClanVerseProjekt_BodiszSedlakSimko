import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private token = localStorage.getItem("token");

  username: string = "";
  email: string = "";
  profilePictureUrl: string | null = null;
  current_password: string ="";
  new_password: string ="";
  confirm_new_password: string ="";
  isEditing: boolean = false;
  selectedFile: File | null = null;

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
          if (userDatas.profilePicture) {
            this.profilePictureUrl = `http://localhost:3000/uploads/${userDatas.profilePicture}`;
          }
        },
        error:(error) => {
          console.error("Hiba a profil adatainak lekérdezése során", error);
        }
      })
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.ngOnInit();
      this.current_password = "";
      this.new_password = "";
      this.confirm_new_password = "";
      this.selectedFile = null;
    }
  }

  updateProfile(): void{
    if(this.token){
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });

      if(this.new_password != this.confirm_new_password){
        alert("Nem egyezik az új jelszó a megerősítő jelszóval");
        return;
      }

      const formData = new FormData();
      formData.append('newUserName', this.username);
      formData.append('newEmail', this.email);
      formData.append('currPass', this.current_password);
      if (this.new_password) {
        formData.append('newPass', this.new_password);
      }
      if (this.selectedFile) {
        formData.append('profilePicture', this.selectedFile);
      }

      this.http.put('http://localhost:3000/api/users/profile', formData, {headers}).subscribe({
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
