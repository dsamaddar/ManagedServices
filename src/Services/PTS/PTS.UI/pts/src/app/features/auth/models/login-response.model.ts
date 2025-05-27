export interface LoginResponse{
    userId: string;
    token: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    roles: string[];
}