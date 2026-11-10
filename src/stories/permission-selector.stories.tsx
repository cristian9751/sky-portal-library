import "../styles.css";
import { useState } from "react";
import {
  PermissionSelector,
  type AdministrationPermission,
} from "@/components/ui/permission-selector";
import { ADMINISTRATION_PERMISSIONS } from "@/lib/administration-permissions";

export const PermissionSelectorExample = () => {
  const [assignedPermissions, setAssignedPermissions] = useState<AdministrationPermission[]>([]);

  return (
    <section className="mx-auto w-full max-w-4xl space-y-4">
      <PermissionSelector
        defaultSelectedPermissions={[ADMINISTRATION_PERMISSIONS.airlineEdit]}
        onAssign={setAssignedPermissions}
      />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {assignedPermissions.length > 0
          ? `Permisos asignados: ${assignedPermissions.join(", ")}`
          : "Selecciona los permisos y pulsa Asignar."}
      </p>
    </section>
  );
};
