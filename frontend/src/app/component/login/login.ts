import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    const loginData = { username: this.username, password: this.password };
    this.http.post('http://localhost:3000/api/users/login', loginData).subscribe({
      next: (response: any) => {
        console.log('Sikeres bejelentkezés:', response);
        
        localStorage.setItem('token', response.token);
        window.location.href = '/dashboard';
      },
      error: (error) => {
        console.error('Hiba a bejelentkezéskor:', error);
      }
    });
  }
}
