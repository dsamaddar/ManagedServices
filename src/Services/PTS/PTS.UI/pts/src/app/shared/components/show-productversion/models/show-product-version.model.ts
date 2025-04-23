import { Attachment } from "../../../../features/product/models/attachment.model";

export interface ShowProductVersion{
    id: number,
    category: string,
    brand: string,
    flavourType: string,
    origin: string,
    sku: string,
    productCode: string,
    packType: string,
    barcode: string,
    attachments: Attachment[];
}