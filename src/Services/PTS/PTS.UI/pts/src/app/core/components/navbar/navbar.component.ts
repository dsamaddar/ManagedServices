import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { User } from '../../../features/auth/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  user?: User;
  isLoginPage: boolean = false;

  constructor(private authService: AuthService, private router: Router){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = this.router.url === '/login';
      }
    });
  }

  ngOnInit(): void {
    this.authService.user()
    .subscribe({
      next: (response) =>{
        console.log(response);
        this.user = response;
      }
    });

    this.user = this.authService.getUser();
  }

  onLogout(): void{
    this.authService.logout();
    this.router.navigateByUrl('login');
  }

}
