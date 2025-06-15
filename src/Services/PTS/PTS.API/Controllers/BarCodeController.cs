using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PTS.API.Data;
using PTS.API.Models.Domain;
using PTS.API.Models.DTO;
using PTS.API.Repositories.Implementation;
using PTS.API.Repositories.Interface;

namespace PTS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BarCodeController : ControllerBase
    {
        private readonly IBarCodeRepository barCodeRepository;
        private readonly ApplicationDbContext dbContext;

        public BarCodeController(IBarCodeRepository barCodeRepository, ApplicationDbContext dbContext)
        {
            this.barCodeRepository = barCodeRepository;
            this.dbContext = dbContext;
        }

        // https://localhost:xxxx/api/barcodes
        [HttpPost]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> CreateBarCode([FromBody] CreateBarCodesDto request)
        {
            // Map DTO to Domain Model
            var barcodes = new BarCodes
            {
                BarCode = request.BarCode,
                ProductId = request.ProductId,
            };

            await barCodeRepository.CreateAsync(barcodes);

            // Domain model to DTO
            var response = new BarCodesDto
            {
                Id = barcodes.Id,
                BarCode = barcodes.BarCode,
            };

            return Ok(response);
        }

        // GET: api/barcodes
        [HttpGet]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> GetAllBarCodes()
        {
            var barcodes = await barCodeRepository.GetAllAsync();

            // Map Domain model to DTO
            var response = new List<BarCodesDto>();

            foreach (var barcode in barcodes)
            {
                response.Add(new BarCodesDto
                {
                    Id = barcode.Id,
                    BarCode = barcode.BarCode,
                });
            }

            return Ok(response);
        }

        // GET: api/barcodes
        [HttpGet("getbarcode-by-product/{productId:int}")]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> GetAllBarCodesByProductId([FromRoute] int productId)
        {
            var barcodes = await barCodeRepository.GetAllByProductIdAsync(productId);

            // Map Domain model to DTO
            var response = new List<BarCodesDto>();

            foreach (var barcode in barcodes)
            {
                response.Add(new BarCodesDto
                {
                    Id = barcode.Id,
                    BarCode = barcode.BarCode,
                });
            }

            return Ok(response);
        }

        // DELETE: /api/barcode/delbarcode-by-name

        [HttpDelete("delbarcode-by-name")]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> DeleteBarCodeByName([FromBody] DeleteBarCodeRequestDto requeset)
        {
            var barcode = await barCodeRepository.DeleteBarCodeByNameAsync(requeset);

            if (barcode is null)
            {
                return NotFound();
            }

            // Convert Domain Model to DTO

            var response = new BarCodesDto
            {
                Id = barcode.Id,
                BarCode = barcode.BarCode,
            };

            return Ok(response);
        }

        // DELETE: /api/barcode/delbarcode-by-name

        [HttpDelete("delbarcode-by-prodid/{productId:int}")]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> DeleteBarCodeByProdId([FromRoute] int productId)
        {
            var barcodes = await barCodeRepository.DeleteByProdIdAsync(productId);

            if (barcodes is null)
            {
                return NotFound();
            }

            // Map Domain model to DTO
            var response = new List<BarCodesDto>();

            foreach (var barcode in barcodes)
            {
                response.Add(new BarCodesDto
                {
                    Id = barcode.Id,
                    BarCode = barcode.BarCode,
                });
            }

            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> DeleteBarCode([FromRoute] int id)
        {
            var barcode = await barCodeRepository.DeleteAsync(id);

            if (barcode is null)
            {
                return NotFound();
            }

            // Convert Domain Model to DTO

            var response = new BarCodesDto
            {
                Id = barcode.Id,
                BarCode = barcode.BarCode,
            };

            return Ok(response);
        }
    }
}
