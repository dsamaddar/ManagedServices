export interface AddProductVersionRequest{
    version: string,
    versionDate: Date,
    description: string,
    cylinderPrNo: string,
    cylinderPoNo: string,
    printingPrNo: string,
    printingPoNo: string,
    productId: number,
    cylinderCompanyId: number,
    printingCompanyId: number,
    userId: string,
}