import { Category } from "../../category/models/category.model";
import { CylinderCompany } from "../../cylinderCompany/models/CylinderCompany.model";
import { PrintingCompany } from "../../printingCompany/models/printingcompany.model";
import { Project } from "../../project/models/project.model";
import { Attachment } from "./attachment.model";

export interface AllProduct{
    id: number,
    categoryId: number,
    projectId: number,
    brand: string,
    flavourType: string,
    origin: string,
    sku: string,
    packType:string,
    version: string,
    projectDate: Date,
    barcode: string,
    cylinderCompanyId: number,
    printingCompanyId: number,
    cylinderCompany: CylinderCompany,
    printingCompany: PrintingCompany,
    category: Category,
    project: Project,
    attachments: Attachment[],
    userId: string,
}