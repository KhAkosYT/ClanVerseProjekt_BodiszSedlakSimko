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

  constructor(private http: HttpClient) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert('A jelszavak nem egyeznek');
      return;
    }
    const registerData = { username: this.username, email: this.email, password: this.password };
    this.http.post('http://localhost:3000/api/register', registerData).subscribe({
      next: (response: any) => {
        console.log('Sikeres regisztráció:', response);
        window.location.href = '/login';
      },
      error: (error) => {
        console.error('Hiba a regisztrációnál:', error);
      }
    });
  }
}
