export interface UpdateProductVersionRequest{
    id: number,
    version: string,
    versionDate: Date,
    description: string,
    prno: string,
    pono: string,
    cylinderCompanyId: number,
    printingCompanyId: number,
    userId: string,
}