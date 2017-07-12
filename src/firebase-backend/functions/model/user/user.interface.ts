export const USERS_PATH = 'user/profile';
export const USERS_SECRET_PATH = 'user/secret';

interface USER_COMMON {
    key?: string;
    uid?: string;
    name?: string;
    email?: string;
    displayName?: string;
    stamp?: number;
    photoURL?: string;
    providerId?: string;
    trash?: boolean;
}

export interface USER_REGISTER {
    email: string;
    password: string;
    displayName: string;
    photoUrl: string;
}

export interface USER_REGISTER_RESONSE {}
export interface USER extends USER_COMMON {};
export type USERS = Array<USER>;