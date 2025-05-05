
EXEC sp_configure 'show advanced options', 1;
RECONFIGURE;
EXEC sp_configure 'Ad Hoc Distributed Queries', 1;
RECONFIGURE;

GO

-- Enable ACE OLEDB Provider
EXEC sp_MSset_oledb_prop 'Microsoft.ACE.OLEDB.12.0', N'AllowInProcess', 1;
EXEC sp_MSset_oledb_prop 'Microsoft.ACE.OLEDB.12.0', N'DynamicParameters', 1;

GO

USE NEOS_PTS;

GO

SET NOCOUNT ON;

declare @tbl_master_data as table(
CATEGORY nvarchar(100),
Brand nvarchar(100),
Flavour nvarchar(200),
ORIGIN nvarchar(100),
SKU nvarchar(100),
PackType nvarchar(100),
CODE nvarchar(100),
ProdVersion nvarchar(100),
ProjectDt date,
BARCODE nvarchar(100),
CylinderCompany nvarchar(200),
PrintingCompany nvarchar(200)
);

insert into @tbl_master_data(CATEGORY,Brand,Flavour,ORIGIN,SKU,PackType,CODE,ProdVersion,ProjectDt,BARCODE,CylinderCompany,PrintingCompany)
SELECT CATEGORY, Brand, [TYPE/FLAVOUR],ORIGINE,SKU,[PACK TYPE],CODE,[VERSION],[DATE],REPLACE(REPLACE(BARCODE ,' ',''), '''','') BARCODE,[CYLINDER COMPANY],[PRINTING COMPANY]
FROM OPENROWSET(
    'Microsoft.ACE.OLEDB.12.0',
    'Excel 12.0;Database=C:\data\product_master.xlsx;HDR=YES;IMEX=1',
    'SELECT * FROM [master$]'
);

DECLARE @CATEGORY NVARCHAR(100),@Brand NVARCHAR(100), @Flavour nvarchar(200), @Origin nvarchar(100), @SKU nvarchar(100), @PackType nvarchar(100);
declare @code nvarchar(100), @prodVersion nvarchar(100), @ProjectDt datetime, @BARCODE nvarchar(100), @CylinderCompany nvarchar(200),@PrintingCompany nvarchar(200)

declare @ProductId as int = null;
declare @CategoryId as int = null;
declare @PackTypeId as int = null;
declare @CylinderCompanyId as int = null;
declare @PrintingCompanyId as int = null;
declare @UserId as nvarchar(100) = 'e07b4029-5a27-491d-9fc5-7043e22ae5eb';

DECLARE cur CURSOR FOR
SELECT CATEGORY,Brand,Flavour,ORIGIN,SKU,PackType,CODE,ProdVersion,ProjectDt,BARCODE,CylinderCompany,PrintingCompany
FROM @tbl_master_data;

OPEN cur;

FETCH NEXT FROM cur INTO @CATEGORY,@Brand,@Flavour,@ORIGIN,@SKU,@PackType,@CODE,@ProdVersion,@ProjectDt,@BARCODE,@CylinderCompany,@PrintingCompany;

WHILE @@FETCH_STATUS = 0
BEGIN
	
	select @CategoryId = Id from Categories where [Name] = @CATEGORY;
	select @PackTypeId = Id from PackTypes where [Name] = @PackType;
	select @CylinderCompanyId = Id from CylinderCompanies where [Name] = @CylinderCompany;
	select @PrintingCompanyId = Id from PrintingCompanies where [Name] = @PrintingCompany;

	if(@CategoryId = 0)
		set @CategoryId = null;

		if(@PackTypeId = 0)
			set @CategoryId = null;

		if(@CylinderCompanyId = 0)
			set @CategoryId = null;

		if(@PrintingCompanyId = 0)
			set @CategoryId = null;

	/*
	print 'Category Id: ' + convert(nvarchar, ISNULL(@CategoryId,0)) 
	+ ' ; PackTypeId: ' + convert(nvarchar, isnull(@packTypeId,0))
	+ ' ; CylinderCompanyId: ' + convert(nvarchar, ISNULL(@CylinderCompanyId,0)) + ' ; ' 
	+ ' ; PrintingCompanyId: ' + convert(nvarchar,isnull(@PrintingCompanyId,0));
    */

	insert into Products(CategoryId,Brand,FlavourType,Origin,SKU,PackTypeId,ProductCode,[Version],ProjectDate,Barcode,CylinderCompanyId,PrintingCompanyId,UserId)
	values(@CategoryId,@Brand,@Flavour,@ORIGIN,@SKU,@PackTypeId,@CODE,@ProdVersion,ISNULL(@ProjectDt,GETDATE()),@BARCODE,@CylinderCompanyId,@PrintingCompanyId,@UserId);

	set @ProductId = SCOPE_IDENTITY();

	print 'Product Id: ' + convert(nvarchar,@ProductId);

	if @ProdVersion is not null
	begin
		if not exists (
		select * from ProductVersions where Version = @prodVersion
		)
		begin
			insert into ProductVersions([Version],VersionDate,Description,ProductId,UserId)
			values(@prodVersion, ISNULL(@ProjectDt,GETDATE()), '', @ProductId, @UserId);
		end
	end

	set @ProductId = null;
	set @CategoryId = null;
	set @PackTypeId = null;
	set @CylinderCompanyId = null;
	set @PrintingCompanyId = null;

    FETCH NEXT FROM cur INTO @CATEGORY,@Brand,@Flavour,@ORIGIN,@SKU,@PackType,@CODE,@ProdVersion,@ProjectDt,@BARCODE,@CylinderCompany,@PrintingCompany;
END

CLOSE cur;
DEALLOCATE cur;

GO