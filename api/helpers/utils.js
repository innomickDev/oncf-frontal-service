export const canManage = permissionName => {
    const userData = JSON.parse(localStorage.getItem("userProfile"));
    let permissonArray = [];
    // if (!userData.data.roles) return true;
    userData.data.roles.map(role => {
      permissonArray.push(role.permissions);
    });
    let permissionUnion = [...new Set(permissonArray)];
    // return permissionUnion[0] ? permissionUnion[0].includes(permissionName) : ""; //todo
    console.log(permissionUnion);
  };
  export const permissions = {
    canNotify: "CanNotify",
    canManageUsers: "CanManageUsers",
    canManageRoles: "CanManageRoles",
    deletable: "Deletable",
    canClaimCreate: "CanClaimCreate",
    canViewCustomerClaims: "CanViewCustomerClaims",
    canChangeClaimStatus: "CanChangeClaimStatus",
    canManageClaimCategories: "CanManageClaimCategories",
    canManageEmailTemplate: "CanManageEmailTemplate",
    canGenerateReports: "CanGenerateReports",
    canImportingDataFiles: "CanImportingDataFiles",
    canViewArchivedCustomerClaims: "CanViewArchivedCustomerClaims",
    canManageStation: "CanManageStation",
    canCreateCustomerClaim: "CanCreateCustomerClaim",
    canManageResponse: "CanManageResponse",
    canChangeClaimAssignment: "CanChangeClaimAssignment",
    canManageGroups: "CanManageGroups",
    canAddRemoveUsersFromGroup: "CanAddRemoveUsersFromGroup"
  };