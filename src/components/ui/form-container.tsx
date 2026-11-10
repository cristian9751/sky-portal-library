import * as React from "react";
import { cn } from "@/lib/utils";

export type FormContainerProps = React.ComponentPropsWithoutRef<"form">;

export const FormContainer = React.forwardRef<HTMLFormElement, FormContainerProps>(
  ({ children, className, ...props }, ref) => (
    <form
      ref={ref}
      className={cn("block w-full min-w-0 rounded-xl border border-border bg-card p-8", className)}
      {...props}
    >
      {children}
    </form>
  ),
);

FormContainer.displayName = "FormContainer";
