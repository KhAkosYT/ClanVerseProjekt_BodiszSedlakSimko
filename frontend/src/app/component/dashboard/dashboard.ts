import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class Dashboard {
  private token = localStorage.getItem('token');
  tokenSignal = signal(this.token);

  constructor(private router: Router) {}

  tokentest() {

  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
