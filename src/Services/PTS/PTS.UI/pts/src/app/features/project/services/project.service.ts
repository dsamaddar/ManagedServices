import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AddProjectRequest } from '../models/add-project-request.model';
import { UpdateProjectRequest } from '../models/update-project-request.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) {}

    getAllProjects(): Observable<Project[]> {
      return this.http.get<Project[]>(
        `${environment.apiBaseUrl}/api/project`
      );
    }

    addProject(model: AddProjectRequest): Observable<void>{
      return this.http.post<void>(`${environment.apiBaseUrl}/api/project`,model);
    }

    getProjectById(id: number): Observable<Project>{
      return this.http.get<Project>(`${environment.apiBaseUrl}/api/project/${id}`);
    }

    updateProject(id: number, updateProjectRequest: UpdateProjectRequest): Observable<Project>{
      return this.http.put<Project>(`${environment.apiBaseUrl}/api/project/${id}`, updateProjectRequest);
    }

    deleteProject(id:number):Observable<Project>{
      return this.http.delete<Project>(`${environment.apiBaseUrl}/api/project/${id}`);
    }

}
