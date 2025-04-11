import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from '../models/project.model';
import { ProjectService } from '../services/project.service';
import { UpdateProjectRequest } from '../models/update-project-request.model';

@Component({
  selector: 'app-edit-project',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css'
})
export class EditProjectComponent implements OnInit, OnDestroy {
  
  id: number = 0;

  paramsSubscription?: Subscription;
  editProjectSubscription?: Subscription;
  deleteProjectSubscription?: Subscription;
  project?: Project;

  constructor(private route: ActivatedRoute,
    private projectService: ProjectService,
    private router: Router
  ){

  }


  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = Number(params.get('id'));

        if(this.id){
          // get data from api for this project id
          this.projectService.getProjectById(this.id)
          .subscribe({
            next: (response) => {
              this.project = response;
            }
          });
        }
      }
    });
  }

  onFormSubmit():void{
    const updateProjectRequest: UpdateProjectRequest = {
      name: this.project?.name ?? '',
      description: this.project?.description ?? ''
    }

    // pass this object to service
    if(this.id){
      this.editProjectSubscription = this.projectService.updateProject(this.id, updateProjectRequest)
      .subscribe({
        next: (response) =>{
          this.router.navigateByUrl('/admin/projects')
        }
      });
    }
  }

  onDelete(): void {
    if(this.id){
      this.deleteProjectSubscription = this.projectService.deleteProject(this.id)
      .subscribe({
        next: (response) => {
          this.router.navigateByUrl('/admin/projects');
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.editProjectSubscription?.unsubscribe();
    this.deleteProjectSubscription?.unsubscribe();
  }
  
 

}
