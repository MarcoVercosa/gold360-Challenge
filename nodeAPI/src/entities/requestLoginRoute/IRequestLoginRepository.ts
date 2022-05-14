export interface IReturn {
    id: number;
    fullName: string;
    email: string;
    lastLogin: string;
}

export interface IRequestLoginRepository {
    RequestLogin: (email: string, password: string) => Promise<Array<IReturn>>
}

