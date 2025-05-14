import { Component } from '@angular/core';
import { FooterComponent } from '../../core/components/footer/footer.component';
import { NavbarComponent } from '../../core/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-default-layout',
  imports: [FooterComponent, NavbarComponent, CommonModule, RouterModule],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.css'
})
export class DefaultLayoutComponent {

}
