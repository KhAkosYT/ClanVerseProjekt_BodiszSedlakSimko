import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  gameName: string = "";
  selectedFile: File | null = null;
  isLoading: boolean = false;


  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.isAdmin();
  }

  isAdmin(): void {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = '/login';
      return;
    }

    this.adminService.getIsAdmin(token).subscribe({
      next: (response) => {
        const isAdmin = (response as any).isAdmin;
        if (!isAdmin) {
          window.location.href = '/';
        }
      },
      error: (error) => {
        console.error("Hiba az admin jogosultság ellenőrzésénél:", error);
        window.location.href = '/';
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
  }

  uploadGame(): void {
    if (this.isLoading) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Nincs bejelentkezve!");
      return;
    }

    if (!this.gameName) {
      alert("Kérlek add meg a játék nevét!");
      return;
    }

    this.isLoading = true;
        const formData = new FormData();
    formData.append('gameName', this.gameName);
    
    if (this.selectedFile) {
      formData.append('gameLogo', this.selectedFile);
    }

    this.adminService.createGame(formData, token).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        alert(response.message || "Játék sikeresen hozzáadva.");
        this.resetForm();
      },
      error: (error) => {
        this.isLoading = false;
        console.error("Hiba a játék feltöltése során:", error);
        this.handleError(error);
      }
    });
  }

  private resetForm(): void {
    this.gameName = "";
    this.selectedFile = null;
    const fileInput = document.getElementById('logo') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }

  private handleError(error: any): void {
    if (error.status === 403) {
      alert("Nincs jogosultságod a játék feltöltéséhez.");
    } else if (error.status === 409) {
      alert("Már létezik ilyen néven játék.");
    } else if (error.status === 400) {
      alert("Hiányzó adatok.");
    } else {
      alert(error.error?.message || "Hiba történt a feltöltés során.");
    }
  }


}
