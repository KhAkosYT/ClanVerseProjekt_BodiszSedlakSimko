import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  private token = localStorage.getItem("token");
  currentUrl: string = '';

  constructor(private http: HttpClient, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    });
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    if (this.token) {
      this.isLoggedIn = true;
      this.fetchIsAdmin();
    }
  }

  fetchIsAdmin() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.http.get('http://localhost:3000/api/admin/is-admin', { headers }).subscribe({
      next: (response) => {
        this.isAdmin = (response as any).isAdmin;
      },
      error: (error) => {
        this.isAdmin = false;
      }
    });
  }

  logout() {
    localStorage.removeItem("token");
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.router.navigate(['/login']);
  }

  isHomeActive(): boolean {
    return this.currentUrl === '/' || this.currentUrl === '/fooldal';
  }

  isProfileActive(): boolean {
    return this.currentUrl.includes('/profile') || this.currentUrl.includes('/admin');
  }
}
