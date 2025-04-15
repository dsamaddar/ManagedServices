export interface UpdateProductRequest{
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
    printingcompanyid: number
}