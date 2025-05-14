import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-no-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './no-layout.component.html',
  styleUrl: './no-layout.component.css',
})
export class NoLayoutComponent {}
