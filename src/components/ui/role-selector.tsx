import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type AssignableRole = {
  id: string;
  name: string;
};

export type RoleSelectorProps = {
  roles: readonly AssignableRole[];
  onAssign: (roleId: string) => void | Promise<void>;
  selectRoleLabel: string;
  assignLabel: string;
  assigningLabel: string;
  assignmentErrorLabel: string;
  noAvailableRolesLabel: string;
  disabled?: boolean;
  onAssigned?: () => void;
};

export function RoleSelector({
  roles,
  onAssign,
  selectRoleLabel,
  assignLabel,
  assigningLabel,
  assignmentErrorLabel,
  noAvailableRolesLabel,
  disabled = false,
  onAssigned,
}: RoleSelectorProps) {
  const selectorId = useId();
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState("");

  const handleAssign = async () => {
    if (!selectedRoleId || disabled || isAssigning) {
      return;
    }

    setError("");
    setIsAssigning(true);
    try {
      await onAssign(selectedRoleId);
      onAssigned?.();
    } catch (assignmentError) {
      setError(assignmentError instanceof Error ? assignmentError.message : assignmentErrorLabel);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="form-label" htmlFor={selectorId}>
          {selectRoleLabel}
        </label>
        <Select
          value={selectedRoleId}
          onValueChange={(roleId) => {
            setSelectedRoleId(roleId);
            setError("");
          }}
          disabled={disabled || isAssigning || roles.length === 0}
        >
          <SelectTrigger id={selectorId}>
            <SelectValue placeholder={selectRoleLabel} />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {roles.length === 0 && (
        <div className="alert alert-warning mb-0" role="status">
          {noAvailableRolesLabel}
        </div>
      )}
      {error && (
        <div className="alert alert-danger mb-0" role="alert">
          {error}
        </div>
      )}
      <div className="flex justify-end">
        <Button
          type="button"
          disabled={disabled || isAssigning || !selectedRoleId}
          onClick={() => void handleAssign()}
        >
          {isAssigning ? assigningLabel : assignLabel}
        </Button>
      </div>
    </div>
  );
}
