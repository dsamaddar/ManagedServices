import { Attachment } from "../../product/models/attachment.model";

export interface ProductVersion{
    id: number,
    version: string,
    versionDate: string,
    description: string,
    productId: number,
    cylinderCompanyId: number,
    printingCompanyId: number,
    userId: string,
    attachments: Attachment[];
}