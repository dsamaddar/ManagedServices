import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';

@Component({
  selector: 'app-project-list',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
  
  projects$?: Observable<Project[]>;

  constructor(private projectService: ProjectService){

  }
  
  ngOnInit(): void {
    this.projects$ = this.projectService.getAllProjects();
  }

}
