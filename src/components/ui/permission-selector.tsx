import * as React from "react";

import { ADMINISTRATION_PERMISSIONS } from "@/lib/administration-permissions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export type AdministrationPermission =
  (typeof ADMINISTRATION_PERMISSIONS)[keyof typeof ADMINISTRATION_PERMISSIONS];

const permissionGroups = [
  {
    title: "Aerolíneas",
    permissions: [
      { value: ADMINISTRATION_PERMISSIONS.airlineCreate, label: "Crear" },
      { value: ADMINISTRATION_PERMISSIONS.airlineEdit, label: "Editar" },
      { value: ADMINISTRATION_PERMISSIONS.airlineDelete, label: "Eliminar" },
    ],
  },
  {
    title: "Aeronaves",
    permissions: [
      { value: ADMINISTRATION_PERMISSIONS.aircraftBuy, label: "Comprar" },
      { value: ADMINISTRATION_PERMISSIONS.aircraftEdit, label: "Editar" },
      { value: ADMINISTRATION_PERMISSIONS.aircraftSell, label: "Vender" },
    ],
  },
  {
    title: "Rutas",
    permissions: [
      { value: ADMINISTRATION_PERMISSIONS.routeCreate, label: "Crear" },
      { value: ADMINISTRATION_PERMISSIONS.routeEdit, label: "Editar" },
      { value: ADMINISTRATION_PERMISSIONS.routeDelete, label: "Eliminar" },
    ],
  },
  {
    title: "Usuarios",
    permissions: [
      { value: ADMINISTRATION_PERMISSIONS.userPermissionsEdit, label: "Editar permisos" },
    ],
  },
] satisfies {
  title: string;
  permissions: { value: AdministrationPermission; label: string }[];
}[];

export interface PermissionSelectorProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  selectedPermissions?: readonly AdministrationPermission[];
  defaultSelectedPermissions?: readonly AdministrationPermission[];
  onSelectionChange?: (permissions: AdministrationPermission[]) => void;
  onAssign: (permissions: AdministrationPermission[]) => void;
  title?: string;
  description?: string;
  assignLabel?: string;
  disabled?: boolean;
  allowEmptySelection?: boolean;
}

export function PermissionSelector({
  selectedPermissions,
  defaultSelectedPermissions = [],
  onSelectionChange,
  onAssign,
  title = "Asignar permisos",
  description = "Selecciona los permisos que deseas asignar.",
  assignLabel = "Asignar",
  disabled = false,
  allowEmptySelection = false,
  className,
  ...props
}: PermissionSelectorProps) {
  const [internalSelection, setInternalSelection] = React.useState<AdministrationPermission[]>(
    () => [...defaultSelectedPermissions],
  );
  const isControlled = selectedPermissions !== undefined;
  const selection = selectedPermissions ?? internalSelection;

  const updateSelection = (permission: AdministrationPermission, checked: boolean) => {
    const nextSelection = checked
      ? selection.includes(permission)
        ? [...selection]
        : [...selection, permission]
      : selection.filter((selected) => selected !== permission);

    if (!isControlled) {
      setInternalSelection(nextSelection);
    }

    onSelectionChange?.(nextSelection);
  };

  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {permissionGroups.map((group) => (
          <fieldset key={group.title} className="min-w-0 space-y-3">
            <legend className="mb-3 text-sm font-semibold">{group.title}</legend>
            <ul className="space-y-3">
              {group.permissions.map(({ value, label }) => {
                const id = `permission-${value.replaceAll(".", "-")}`;

                return (
                  <li key={value}>
                    <label htmlFor={id} className="flex cursor-pointer items-center gap-3 text-sm">
                      <Checkbox
                        id={id}
                        checked={selection.includes(value)}
                        disabled={disabled}
                        onCheckedChange={(checked) => updateSelection(value, checked === true)}
                      />
                      <span>{label}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        ))}
      </CardContent>
      <CardFooter className="justify-end border-t p-4">
        <Button
          type="button"
          disabled={disabled || (!allowEmptySelection && selection.length === 0)}
          onClick={() => onAssign([...selection])}
        >
          {assignLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}
