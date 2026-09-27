package com.hr_management.Repository;

import com.hr_management.ENUM.Permissions;
import com.hr_management.ENUM.Role;

import java.util.*;

public class RoleBasedPermissions {
    public static Map<Role, Set<Permissions>> getRoleBasedPermissions(){
        Map<Role,Set<Permissions>> perm=new HashMap<>();
        perm.put(Role.ADMIN,new HashSet<Permissions>(Arrays.asList(
                Permissions.CREATE_EMPLOYEE,
                Permissions.UPDATE_EMPLOYEE,
                Permissions.VIEW_EMPLOYEE,
                Permissions.RUN_PAYROLL,
                Permissions.VIEW_PAYROLL,
                Permissions.APPROVE_LEAVE,
                Permissions.VIEW_ANALYSIS,
                Permissions.VIEW_HOLIDAY,
                Permissions.DELETE_EMPLOYEE)));
        perm.put(Role.HR, new HashSet<Permissions>(Arrays.asList(
                Permissions.CREATE_EMPLOYEE,
                Permissions.UPDATE_EMPLOYEE,
                Permissions.VIEW_EMPLOYEE,
                Permissions.APPROVE_LEAVE,
                Permissions.APPLY_WFH,
                Permissions.APPROVE_WFH,
                Permissions.VIEW_PAYROLL,
                Permissions.VIEW_HOLIDAY,
                Permissions.APPROVE_LEAVE)));
        perm.put(Role.EMPLOYEE, new HashSet<Permissions>(Arrays.asList(
                Permissions.APPLY_LEAVE,
                Permissions.VIEW_ATTENDANCE,
                Permissions.VIEW_HOLIDAY,
                Permissions.VIEW_PAYROLL,
                Permissions.APPLY_WFH)));
        return perm;
    }
}
