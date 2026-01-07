import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})

export class Navbar implements OnInit {
  private token = localStorage.getItem("token");

  ngOnInit(): void {
    if(this.token){
      const navbarUl = document.getElementById("navbar-ul");
      if (navbarUl){
        /*
        <li class="nav-item">
          <a class="nav-link" routerLink="/createclan">Create Clan</a>
        </li>
        */
        const a = document.createElement("a");
        a.setAttribute ("class", "nav-link");
        a.setAttribute ("routerlink", "/profile");
        a.setAttribute("href","/profile");
        a.innerText = "profil";

        const li = document.createElement("li");
        li.setAttribute ("class", "nav-item");
        li.appendChild (a);

        navbarUl.appendChild(li)
       }
    }
  }
}
