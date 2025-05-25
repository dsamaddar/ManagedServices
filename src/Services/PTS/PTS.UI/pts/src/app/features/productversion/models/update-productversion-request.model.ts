export interface UpdateProductVersionRequest{
    id: number,
    version: string,
    versionDate: Date,
    description: string,
    cylinderPrNo: string,
    cylinderPoNo: string,
    printingPrNo: string,
    printingPoNo: string,
    cylinderCompanyId: number,
    printingCompanyId: number,
    userId: string,
}