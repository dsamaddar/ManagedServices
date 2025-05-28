export interface AddProductVersionRequest{
    version: string,
    versionDate: Date,
    description: string | null,
    cylinderPrNo: string | null,
    cylinderPoNo: string | null,
    printingPrNo: string | null,
    printingPoNo: string | null,
    productId: number,
    cylinderCompanyId: number | null,
    printingCompanyId: number | null,
    userId: string,
}