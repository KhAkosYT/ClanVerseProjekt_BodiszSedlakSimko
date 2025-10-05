import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.css'
})

export class Login {
  email: string = '';
  password: string = '';

  onSubmit() {
    console.log('Bejelentkezés megkísérlése:', { email: this.email, password: this.password });
  }
}
