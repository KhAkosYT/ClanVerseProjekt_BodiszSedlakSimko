import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './registration.html',
  styleUrl: './registration.css'
})

export class Registration {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  profilePicture: File | null = null;
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profilePicture = input.files[0];
    }
  }

  onSubmit() {
    this.errorMessage = '';
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'A jelszavak nem egyeznek!';
      return;
    }
    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('email', this.email);
    formData.append('password', this.password);
    if (this.profilePicture) {
      formData.append('profilePicture', this.profilePicture, this.profilePicture.name);
    }
    this.userService.register(formData).subscribe({
      next: (response: any) => {
        console.log('Sikeres regisztráció:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Hiba a regisztrációnál:', error);
        this.errorMessage = error.error.reason || error.error.message || 'Hiba történt a regisztráció során.';
      }
    });
  }
}
