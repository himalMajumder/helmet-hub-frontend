export type TokenType = string | null;

export interface BikeModelType {
    uuid: string;
    name: string;
    detail: string;
    status: string;
}


export interface PermissionType {
    id: number;
    name: string;
    module: string;
}

export interface RoleType {
    id: number;
    name: string;
    permissions?: PermissionType[];
}


export interface UserType {
    uuid: string;
    name: string;
    email: string;
    status: string;
    roles?: RoleType[];
}


