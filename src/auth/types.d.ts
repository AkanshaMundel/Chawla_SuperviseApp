namespace Auth {
    enum RoleIndex {
        SUPERVISOR = "SUPERVISOR",
        UNKNOWN = "UNKNOWN",
    }
    interface LoginData {
        name?: string;
        profilePicture?: string;
        loginData: {
            success: boolean;
            userId: string;
            role?: RoleIndex;
            name: string;
            email?: string;
            phoneNumber?: string;
            profilePicture?: string;
        }
    }
}