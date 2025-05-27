using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PTS.API.Migrations.ApplicationDb
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
                name: "PackTypes",
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
                    table.PrimaryKey("PK_PackTypes", x => x.Id);
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
                name: "RefreshTokens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Token = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Expires = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsRevoked = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshTokens", x => x.Id);
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
                    ProductCode = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Version = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ProjectDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PackTypeId = table.Column<int>(type: "int", nullable: true),
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
                        name: "FK_Products_PackTypes_PackTypeId",
                        column: x => x.PackTypeId,
                        principalTable: "PackTypes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "BarCodes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BarCode = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ProductId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BarCodes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BarCodes_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductVersions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Version = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    VersionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CylinderPrNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CylinderPoNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PrintingPrNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PrintingPoNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    CylinderCompanyId = table.Column<int>(type: "int", nullable: true),
                    PrintingCompanyId = table.Column<int>(type: "int", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductVersions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductVersions_CylinderCompanies_CylinderCompanyId",
                        column: x => x.CylinderCompanyId,
                        principalTable: "CylinderCompanies",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductVersions_PrintingCompanies_PrintingCompanyId",
                        column: x => x.PrintingCompanyId,
                        principalTable: "PrintingCompanies",
                        principalColumn: "Id");
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

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Description", "Name", "UserId" },
                values: new object[,]
                {
                    { 1, ".", "BAKERY", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 2, ".", "BEVERAGE", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 3, ".", "CONDIMENTS", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 4, ".", "CONFECTIONARY", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 5, ".", "DAIRY", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 6, ".", "DRINKING WATER", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 7, ".", "FRUIT DRINK", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 8, ".", "GRAINS", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 9, ".", "MEAT", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 10, ".", "PERSONAL CARE", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 11, ".", "SNACKS", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" }
                });

            migrationBuilder.InsertData(
                table: "CylinderCompanies",
                columns: new[] { "Id", "Description", "Name", "UserId" },
                values: new object[,]
                {
                    { 1, ".", "BANGLA - SHANGHAI PLATE MAKING LTD.", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 2, ".", "DIGITAL ENGRAVERS LTD.", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 3, ".", "MASTER PLATE MAKING(BD) CO.LTD.", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 4, ".", "PRINTO PACK SYNDICATE", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" }
                });

            migrationBuilder.InsertData(
                table: "PackTypes",
                columns: new[] { "Id", "Description", "Name", "UserId" },
                values: new object[,]
                {
                    { 1, ".", "BAG", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 2, ".", "BOX", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 3, ".", "BRICK", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 4, ".", "CAN", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 5, ".", "CHASE", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 6, ".", "CLUSTER", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 7, ".", "COMBIFIT", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 8, ".", "CONTAINER", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 9, ".", "CUP", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 10, ".", "FAT CAN", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 11, ".", "FOIL", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 12, ".", "GLASS BOTTLE", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 13, ".", "GLASS JAR", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 14, ".", "MASTER CARTON", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 15, ".", "PET", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 16, ".", "PILLOW", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 17, ".", "PLASTIC JAR", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 18, ".", "POLY", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 19, ".", "POUCH", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 20, ".", "PRISMA", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 21, ".", "SASSY", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 22, ".", "SHRINK", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 23, ".", "STANDING POUCH", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 24, ".", "TIN CONTAINER", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 25, ".", "UHT POUCH", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 26, ".", "WRAPPER", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" }
                });

            migrationBuilder.InsertData(
                table: "PrintingCompanies",
                columns: new[] { "Id", "Description", "Name", "UserId" },
                values: new object[,]
                {
                    { 1, ".", "AFBL FOOD PARK", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 2, ".", "AKIJ PRINTING & PACKAGES LTD", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 3, ".", "ANNAN PACK LIMITED", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 4, ".", "ARBAB PACK LIMITED", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 5, ".", "BENGAL PRINTING & PACKAGING", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 6, ".", "FRESH PACK INDUSTRIES", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 7, ".", "MAHTAB FLEXIBLE PRINTING PRESS", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 8, ".", "PREMIAFLEX PLASTICS LTD", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 9, ".", "SHAJINAZ EXIM PACK LTD", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                    { 10, ".", "TAMPACO FOILS LTD", "e07b4029-5a27-491d-9fc5-7043e22ae5eb" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Attachments_ProductVersionId",
                table: "Attachments",
                column: "ProductVersionId");

            migrationBuilder.CreateIndex(
                name: "IX_BarCodes_BarCode",
                table: "BarCodes",
                column: "BarCode",
                unique: true,
                filter: "[BarCode] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_BarCodes_ProductId",
                table: "BarCodes",
                column: "ProductId");

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
                name: "IX_PackTypes_Name",
                table: "PackTypes",
                column: "Name",
                unique: true,
                filter: "[Name] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_PrintingCompanies_Name",
                table: "PrintingCompanies",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryId",
                table: "Products",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_PackTypeId",
                table: "Products",
                column: "PackTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductVersions_CylinderCompanyId",
                table: "ProductVersions",
                column: "CylinderCompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductVersions_PrintingCompanyId",
                table: "ProductVersions",
                column: "PrintingCompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductVersions_ProductId",
                table: "ProductVersions",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductVersions_Version",
                table: "ProductVersions",
                column: "Version",
                unique: true,
                filter: "[Version] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Attachments");

            migrationBuilder.DropTable(
                name: "BarCodes");

            migrationBuilder.DropTable(
                name: "RefreshTokens");

            migrationBuilder.DropTable(
                name: "ProductVersions");

            migrationBuilder.DropTable(
                name: "CylinderCompanies");

            migrationBuilder.DropTable(
                name: "PrintingCompanies");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "PackTypes");
        }
    }
}
