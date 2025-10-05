import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registration',
  imports: [FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.css'
})

export class Registration {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert('A jelszavak nem egyeznek');
      return;
    }
    console.log('Regisztráció megkísérlése:', { username: this.username, email: this.email, password: this.password });  // Ide jöhet a http kérés a backend felé
  }
}
