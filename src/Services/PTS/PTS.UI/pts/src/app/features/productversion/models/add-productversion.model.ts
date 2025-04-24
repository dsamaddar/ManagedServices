export interface AddProductVersionRequest{
    version: string,
    versionDate: Date,
    description: string,
    productId: number,
    userId: string,
}