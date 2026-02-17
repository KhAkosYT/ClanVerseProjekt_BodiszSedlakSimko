import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../../services/user.service';  

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {
  username: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router) {}


  onSubmit() {
    const loginData = { username: this.username, password: this.password };
    this.userService.login(loginData).subscribe({
      next: (response: any) => {
        console.log('Sikeres bejelentkezés:', response);
        
        localStorage.setItem('token', response.token);
        this.router.navigate(['/fooldal']);
      },
      error: (error) => {
        console.error('Hiba a bejelentkezéskor:', error);
      }
    });
  }
}
