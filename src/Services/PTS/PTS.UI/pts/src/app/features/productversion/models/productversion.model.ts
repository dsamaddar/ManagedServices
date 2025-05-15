import { CylinderCompany } from "../../cylinderCompany/models/CylinderCompany.model";
import { PrintingCompany } from "../../printingCompany/models/printingcompany.model";
import { Attachment } from "../../product/models/attachment.model";

export interface ProductVersion{
    id: number,
    version: string,
    versionDate: string,
    description: string,
    prno: string,
    pono: string,
    productId: number,
    cylinderCompanyId: number,
    printingCompanyId: number,
    userId: string,
    attachments: Attachment[];
    cylinderCompany: CylinderCompany;
    printingCompany: PrintingCompany;
}