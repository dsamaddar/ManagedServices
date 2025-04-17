import { Category } from "../../category/models/category.model";
import { CylinderCompany } from "../../cylinderCompany/models/CylinderCompany.model";
import { PrintingCompany } from "../../printingCompany/models/printingcompany.model";
import { Project } from "../../project/models/project.model";
import { Attachment } from "./attachment.model";

export interface AllProduct{
    id: number,
    categoryid: number,
    projectid: number,
    brand: string,
    flavourtype: string,
    origin: string,
    sku: string,
    packtype:string,
    version: string,
    projectdate: Date,
    barcode: string,
    cylindercompanyid: number,
    printingcompanyid: number,
    cylindercompany: CylinderCompany,
    printingcompany: PrintingCompany,
    category: Category,
    project: Project,
    attachments: Attachment[],
}