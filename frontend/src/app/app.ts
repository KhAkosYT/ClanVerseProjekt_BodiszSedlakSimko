import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import {Navbar} from './component/navbar/navbar';
import {Footer} from './component/footer/footer';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(public userService: UserService) {}

  protected readonly title = signal('ClanVerse');
}

