import { Attachment } from "../../product/models/attachment.model";

export interface ProductVersion{
    id: number,
    version: string,
    versionDate: string,
    productId: number,
    userId: string,
    attachments: Attachment[];
}