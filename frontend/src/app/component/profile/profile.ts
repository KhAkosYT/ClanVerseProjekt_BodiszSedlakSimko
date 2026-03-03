import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

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
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router){
    console.log("Profil component")
  }

  ngOnInit(): void {
    if(this.token){
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });

      this.userService.getProfile().subscribe({
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
      this.errorMessage = '';
    }
  }

  updateProfile(): void{
    if(this.token){
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });
      this.errorMessage = '';

      if(this.new_password != this.confirm_new_password){
        this.errorMessage = "Nem egyezik az új jelszó a megerősítő jelszóval!";
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

      this.userService.updateProfile(formData).subscribe({
        next: (data) => {
          alert("Sikeresen frissítetted a profilodat!");
          console.log(data);
          window.location.reload();
        },
        error:(error)=> {
          console.error("Hiba a profil frissítése során", error);
          this.errorMessage = error.error.reason || error.error.message || 'Hiba történt a profil frissítése során.';
        }
      })
    }
  }

}
