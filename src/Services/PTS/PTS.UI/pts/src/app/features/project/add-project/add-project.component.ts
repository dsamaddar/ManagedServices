import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Project } from '../models/project.model';
import { AddProjectRequest } from '../models/add-project-request.model';
import { Subscription } from 'rxjs';
import { subscriptionLogsToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-add-project',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css'
})
export class AddProjectComponent implements OnDestroy {

  model: AddProjectRequest;

  private addProjectSubscription?: Subscription;

  constructor(private projectService: ProjectService, private router: Router){
    this.model = {
      name: '',
      description: '',
    }
  }

  onFormSubmit(){
    this.addProjectSubscription = this.projectService.addProject(this.model)
    .subscribe({
      next: (response) => {

        console.log('this was successful');
        this.router.navigateByUrl('/admin/projects');
      },
      error: (error) => {

      }
    });
  }

  ngOnDestroy(): void {
    this.addProjectSubscription?.unsubscribe();
  }
}
