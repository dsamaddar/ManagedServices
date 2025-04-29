import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError, Observable, of, Subscription } from 'rxjs';
import { PackType } from '../models/packtype.model';
import { PacktypeService } from '../services/packtype.service';
import { ToastrUtils } from '../../../utils/toastr-utils';

@Component({
  selector: 'app-packtype-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './packtype-list.component.html',
  styleUrl: './packtype-list.component.css',
})
export class PacktypeListComponent implements OnInit {
  packtypes$?: Observable<PackType[]>;
  private listPackTypeSubscription?: Subscription;

  constructor(
    private packTypeSerivce: PacktypeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.packtypes$ = this.packTypeSerivce.getAllPackTypes().pipe(
      catchError((error) => {
        ToastrUtils.showErrorToast('Failed to load Packtypes');
        return of([]);
      })
    );
  }
}
