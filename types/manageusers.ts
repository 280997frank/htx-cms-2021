import { TPermissions } from "./auth";

export interface TManageUsers {
  email: string;
  isActive?: boolean;
  role: string;
  name: string;
}

export interface TManageUsersTable extends TManageUsers {
  id: string;
}

export interface TManageUsersForm extends TManageUsers {
  id?: string;
  password?: string;
  permissions: TPermissions[];
}

export interface TManageUsersResponse extends TManageUsers {
  id?: string;
  password?: string;
  permissions?: {
    [key: string]: string;
  };
}

export interface TManageUsersSubmit extends TManageUsers {
  id?: string;
  password?: string;
  setPermission?: {
    [key: string]: string;
  };
}

export interface DeleteManageUsersResponse {
  id: string;
}

export interface DeleteManageUsersArg {
  id: string;
}

export interface PublishManageUsersResponse {
  success: boolean;
}
export interface PublishManageUsersArg {
  publishUserInput: {
    id: string;
    isActive: boolean;
  };
}

export interface InsertManageUsersResponse {
  id: string;
}
export interface InsertManageUsersArgs {
  createUserInput: TManageUsersSubmit;
}

export interface UpdateManageUsersResponse {
  id: string;
}
export interface UpdateManageUsersArgs {
  updateUserInput: TManageUsersSubmit;
}
