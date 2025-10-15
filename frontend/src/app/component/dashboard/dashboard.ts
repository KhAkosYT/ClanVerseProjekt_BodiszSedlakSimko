import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class Dashboard {
  private token = localStorage.getItem('token');
  tokenSignal = signal(this.token);

  tokentest() {
    
  }
}
