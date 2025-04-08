using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PTS.API.Models.Domain;
using PTS.API.Models.DTO;
using PTS.API.Repositories.Implementation;
using PTS.API.Repositories.Interface;

namespace PTS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectRepository projectRepository;

        public ProjectController(IProjectRepository projectRepository)
        {
            this.projectRepository = projectRepository;
        }

        // POST: api/projects

        [HttpPost]
        public async Task<IActionResult> CreateProjects([FromBody] CreateProjectRequestDto request)
        {
            // Map DTO to Domain Model
            var project = new Project
            {
                Name = request.Name,
                Description = request.Description
            };

            await projectRepository.CreateAsync(project);

            // Domain model to DTO
            var response = new ProjectDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description
            };

            return Ok(response);
        }

        // GET: /api/projects
        [HttpGet]
        public async Task<IActionResult> GetAllProjects()
        {
            var projects = await projectRepository.GetAllAsync();

            // Map Domain model to DTO
            var response = new List<ProjectDto>();
            foreach (var project in projects)
            {
                response.Add(new ProjectDto
                {
                    Id = project.Id,
                    Name = project.Name,
                    Description = project.Description
                });
            }

            return Ok(response);
        }

        //  GET: /api/projects/{id}
        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetCategoryById([FromRoute] int id)
        {
            var existingProject = await projectRepository.GetById(id);

            if (existingProject is null)
            {
                return NotFound();
            }

            var response = new CategoryDto
            {
                Id = existingProject.Id,
                Name = existingProject.Name,
                Description = existingProject.Description,
            };

            return Ok(response);
        }

        // PUT: /api/projects/{id}
        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> EditCategory([FromRoute] int id, UpdateProjectRequestDto request)
        {
            // Convert DTO to Domain Model
            var project = new Project
            {
                Id = id,
                Name = request.Name,
                Description = request.Description,
            };

            project = await projectRepository.UpdateAsync(project);

            if (project == null)
            {
                return NotFound();
            }

            // Convert Domain Model to DTO
            var response = new ProjectDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description
            };

            return Ok(response);
        }


        // DELETE: /api/projects/{id}

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> DeleteCategory([FromRoute] int id)
        {
            var category = await projectRepository.DeleteAsync(id);

            if (category is null)
            {
                return NotFound();
            }

            // Convert Domain Model to DTO

            var response = new CategoryDto
            {

                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
            };

            return Ok(response);
        }
    }
}
