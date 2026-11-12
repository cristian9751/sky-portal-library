import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  PermissionSelector,
  type AdministrationPermission,
} from "@/components/ui/permission-selector";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type PermissionAirline = {
  id: string;
  name: string;
};

export type MultiAirlinePermissionSelectorProps = {
  airlines: readonly PermissionAirline[];
  selectedAirlineIds: readonly string[];
  onSelectedAirlineIdsChange: (airlineIds: string[]) => void;
  permissionsByAirline: Readonly<Record<string, readonly AdministrationPermission[]>>;
  onPermissionsChange: (airlineId: string, permissions: AdministrationPermission[]) => void;
  availablePermissions: readonly AdministrationPermission[];
  airlineLabel: string;
  selectAirlineLabel: string;
  permissionTitle: string;
  permissionDescription: string;
  idPrefix: string;
  disabled?: boolean;
};

export function MultiAirlinePermissionSelector({
  airlines,
  selectedAirlineIds,
  onSelectedAirlineIdsChange,
  permissionsByAirline,
  onPermissionsChange,
  availablePermissions,
  airlineLabel,
  selectAirlineLabel,
  permissionTitle,
  permissionDescription,
  idPrefix,
  disabled = false,
}: MultiAirlinePermissionSelectorProps) {
  const selectedAirlines = airlines.filter((airline) => selectedAirlineIds.includes(airline.id));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <span className="form-label" id={`${idPrefix}-airlines-label`}>
          {airlineLabel}
        </span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between"
              aria-labelledby={`${idPrefix}-airlines-label`}
              disabled={disabled || airlines.length === 0}
            >
              {selectedAirlines.length > 0
                ? selectedAirlines.map((airline) => airline.name).join(", ")
                : selectAirlineLabel}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="max-h-72 overflow-y-auto">
            <div className="space-y-3">
              {airlines.map((airline) => {
                const checked = selectedAirlineIds.includes(airline.id);
                const checkboxId = `${idPrefix}-airline-${airline.id}`;

                return (
                  <label
                    key={airline.id}
                    htmlFor={checkboxId}
                    className="flex cursor-pointer items-center gap-3 text-sm"
                  >
                    <Checkbox
                      id={checkboxId}
                      checked={checked}
                      disabled={disabled}
                      onCheckedChange={(value) =>
                        onSelectedAirlineIdsChange(
                          value === true
                            ? checked
                              ? [...selectedAirlineIds]
                              : [...selectedAirlineIds, airline.id]
                            : selectedAirlineIds.filter((id) => id !== airline.id),
                        )
                      }
                    />
                    <span>{airline.name}</span>
                  </label>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {selectedAirlines.map((airline) => (
        <PermissionSelector
          key={airline.id}
          idPrefix={`${idPrefix}-${airline.id}-permission`}
          availablePermissions={availablePermissions}
          selectedPermissions={permissionsByAirline[airline.id] ?? []}
          onSelectionChange={(permissions) => onPermissionsChange(airline.id, permissions)}
          title={`${airline.name} — ${permissionTitle}`}
          description={permissionDescription}
          disabled={disabled}
          allowEmptySelection
          showAssignButton={false}
        />
      ))}
    </div>
  );
}
