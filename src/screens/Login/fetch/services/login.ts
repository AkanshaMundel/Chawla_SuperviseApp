import AxiosFactory from "../../../../axios/AxiosFactory";
import apiIndex from "../apis";
import BaseInstance from "../instance";

export interface LoginCredentials {
    email?: string;
    password: string;
    phone?: number;
    userAgent?:any; 
    platform?:any
    ipAddress?:any
}

enum RoleIndex {
    SUPERVISOR = "SUPERVISOR",
    UNKNOWN = "UNKNOWN",
}

export interface LoginData {
    loginData: {
        success: boolean;
        userId: string;
        role?: RoleIndex;
        name: string;
        email?: string;
        phone?: number;
    }
}

export default async function login(data: LoginCredentials) {

    const res = AxiosFactory.createInstance().post(apiIndex.login, data);
    console.log("postdataa", res);
    return res;
}