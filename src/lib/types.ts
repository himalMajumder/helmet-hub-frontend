import { LucideIcon } from "lucide-react";

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
    super_admin: boolean;
    roles?: RoleType[];
    permissions?: PermissionType[];
}


export type MenuItemType = {
    icon: LucideIcon;
    label: string;
    path: string;
    permission?: string; // Optional permission field
    subItems?: MenuItemType[]; // Optional subItems array (for nested menus)
};



export interface ProductType {
    uuid: string;
    name: string;
    type: string;
    model_number: string;
    status: string;
}