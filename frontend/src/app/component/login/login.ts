import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login implements OnInit{
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if(token){
      this.router.navigate(['/fooldal']);
    }
  }

  onSubmit() {
    this.errorMessage = '';
    const loginData = { username: this.username, password: this.password };
    this.userService.login(loginData).subscribe({
      next: (response: any) => {
        console.log('Sikeres bejelentkezés:', response);
        
        localStorage.setItem('token', response.token);
        window.location.reload();
      },
      error: (error) => {
        console.error('Hiba a bejelentkezéskor:', error);
        this.errorMessage = error.error.reason || error.error.message || 'Hibás felhasználónév vagy jelszó.';
      }
    });
  }
}
