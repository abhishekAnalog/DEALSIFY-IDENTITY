interface Permission {
    _id: string;
    moduleName: string;
}

interface AuthUser {
    _id: string;
    name: string;
    roleName: string;
    companyId: string;
    permissions: Permission[];
    succeeded: boolean;
    errors: null | any;
    statusCode: number;
    message: string;
    status: string;
}