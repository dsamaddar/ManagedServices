using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PTS.API.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CylinderCompanies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CylinderCompanies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PrintingCompanies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrintingCompanies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProductCodes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductCodes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryId = table.Column<int>(type: "int", nullable: true),
                    Brand = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    FlavourType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Origin = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    SKU = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    PackType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Version = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ProjectDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Barcode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CylinderCompanyId = table.Column<int>(type: "int", nullable: true),
                    PrintingCompanyId = table.Column<int>(type: "int", nullable: true),
                    ProductCodeId = table.Column<int>(type: "int", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Products_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Products_CylinderCompanies_CylinderCompanyId",
                        column: x => x.CylinderCompanyId,
                        principalTable: "CylinderCompanies",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Products_PrintingCompanies_PrintingCompanyId",
                        column: x => x.PrintingCompanyId,
                        principalTable: "PrintingCompanies",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Products_ProductCodes_ProductCodeId",
                        column: x => x.ProductCodeId,
                        principalTable: "ProductCodes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductVersions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Version = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VersionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductVersions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductVersions_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Attachments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Tag = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TrackingId = table.Column<int>(type: "int", nullable: false),
                    ProductVersionId = table.Column<int>(type: "int", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attachments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Attachments_ProductVersions_ProductVersionId",
                        column: x => x.ProductVersionId,
                        principalTable: "ProductVersions",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Attachments_ProductVersionId",
                table: "Attachments",
                column: "ProductVersionId");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Name",
                table: "Categories",
                column: "Name",
                unique: true,
                filter: "[Name] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_CylinderCompanies_Name",
                table: "CylinderCompanies",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PrintingCompanies_Name",
                table: "PrintingCompanies",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductCodes_Name",
                table: "ProductCodes",
                column: "Name",
                unique: true,
                filter: "[Name] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryId",
                table: "Products",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_CylinderCompanyId",
                table: "Products",
                column: "CylinderCompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_PrintingCompanyId",
                table: "Products",
                column: "PrintingCompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_ProductCodeId",
                table: "Products",
                column: "ProductCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductVersions_ProductId",
                table: "ProductVersions",
                column: "ProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Attachments");

            migrationBuilder.DropTable(
                name: "ProductVersions");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "CylinderCompanies");

            migrationBuilder.DropTable(
                name: "PrintingCompanies");

            migrationBuilder.DropTable(
                name: "ProductCodes");
        }
    }
}
