import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  private token = localStorage.getItem("token");
  currentUrl: string = '';
  games: any[] = [];
  selectedGames: { [id: number]: boolean } = {};

  constructor(private adminService: AdminService, private router: Router, private gameService: GameService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
        if (this.isClansPage()) {
          this.fetchGamesForFilter();
        } else {
          this.games = [];
          this.selectedGames = {};
        }
      }
    });
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    if (this.token) {
      this.isLoggedIn = true;
      this.fetchIsAdmin();
    }
    if (this.isClansPage()) {
      this.fetchGamesForFilter();
    }
  }

  fetchIsAdmin() {
    if( !this.token) return;

    this.adminService.getIsAdmin(this.token).subscribe({
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

  isClansPage(): boolean {
    return this.currentUrl === '/clans';
  }

  fetchGamesForFilter(): void {
    if (this.games.length > 0) {
      return;
    }
    this.gameService.getGames().subscribe({
      next: (data: any) => {
        this.games = data.games || [];
      },
      error: (err) => {
        console.error('Hiba a játékok lekérésekor a szűrőhöz:', err);
      }
    });
  }

  onFilterChange(): void {
    const selectedIds = Object.keys(this.selectedGames)
      .filter(id => this.selectedGames[parseInt(id, 10)])
      .map(id => parseInt(id, 10));
    this.gameService.updateSelectedGames(selectedIds);
  }
}