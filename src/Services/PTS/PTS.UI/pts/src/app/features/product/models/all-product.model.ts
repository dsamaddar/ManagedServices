import { BarCodes } from "../../barcode/models/barcode.model";
import { Category } from "../../category/models/category.model";
import { CylinderCompany } from "../../cylinderCompany/models/CylinderCompany.model";
import { PackType } from "../../packtype/models/packtype.model";
import { PrintingCompany } from "../../printingCompany/models/printingcompany.model";
import { ProductCode } from "../../productCode/models/productcode.model";
import { ProductVersion } from "../../productversion/models/productversion.model";
import { Attachment } from "./attachment.model";

export interface AllProduct{
    id: number,
    categoryId: number,
    packTypeId: number,
    brand: string,
    flavourType: string,
    origin: string,
    sku: string,
    productCode: string,
    version: string,
    projectDate: Date,
    category: Category,
    packType: PackType,
    barCodes: BarCodes[],
    productVersions: ProductVersion[],
    userId: string,
}