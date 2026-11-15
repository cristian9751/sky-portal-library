import * as React from "react";
import { cn } from "@/lib/utils";

export type FormContainerProps = React.ComponentPropsWithoutRef<"form"> & {
    title?: string | null
    centerText?: boolean;
};

export const FormContainer = React.forwardRef<HTMLFormElement, FormContainerProps>(
  ({ children, className, title, centerText, ...props }, ref) => (
    <>
      <form
        ref={ref}
        className={cn("block w-full min-w-0 rounded-xl border border-border bg-card p-8", className)}
        {...props}
      >
        {title && (
          centerText ? (
            <div className="w-full md:pb-2">
              <h3 className="text-center">{title}</h3>
            </div>
          ) :
            <h3>{title}</h3>
        )}
        {children}
      </form>
    </>
    
  ),
);

FormContainer.displayName = "FormContainer";
