enum RoleIndex {
    SUPERVISOR = "SUPERVISOR",
    UNKNOWN = "UNKNOWN",
}
export default RoleIndex;
export type Roles = keyof typeof RoleIndex;
