export interface AddProductVersionRequest{
    version: string,
    versionDate: Date,
    description: string,
    prno: string,
    pono: string,
    productId: number,
    cylinderCompanyId: number,
    printingCompanyId: number,
    userId: string,
}