export class UserPermissionResponse {
    _id: string;
    name: string;
    roleName: string;
    password: string;
    companyId: number;
    permissions: usersPermission;
}

interface usersPermission {
    _id: string;
    moduleName: string;
}