import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  imports: [FormsModule, RouterLink],
  templateUrl: './registration.html',
  styleUrl: './registration.css'
})

export class Registration {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  profilePicture: File | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profilePicture = input.files[0];
    }
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert('A jelszavak nem egyeznek');
      return;
    }
    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('email', this.email);
    formData.append('password', this.password);
    if (this.profilePicture) {
      formData.append('profilePicture', this.profilePicture, this.profilePicture.name);
    }
    this.http.post('http://localhost:3000/api/users/register', formData).subscribe({
      next: (response: any) => {
        console.log('Sikeres regisztráció:', response);
        window.location.href = '/login';
      },
      error: (error) => {
        console.error('Hiba a regisztrációnál:', error);
        alert('Hiba a regisztrációnál: ' + (error.error.reason || error.message));
      }
    });
  }
}
