import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService){

  }

  ngOnInit(): void {
    this.authService.user()
    .subscribe({
      next: (response) =>{
        console.log(response);
      }
    });
  }

}
