export interface AddProductVersionRequest{
    version: string,
    versionDate: Date,
    description: string,
    productId: number,
    cylinderCompanyId: number,
    printingCompanyId: number,
    userId: string,
}