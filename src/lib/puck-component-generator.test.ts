import { describe, expect, it } from "vitest";
import * as ts from "typescript";
import { downloadReactComponent, generateReactComponent } from "./puck-component-generator";

describe("generateReactComponent", () => {
  it("generates valid TSX with per-component action callbacks", async () => {
    const source = generateReactComponent({
      root: { props: { title: "Flight dashboard" } },
      content: [
        {
          type: "UiButton",
          props: { id: "book-flight", label: "Book a flight", variant: "default", size: "default" },
        },
        {
          type: "UiSelect",
          props: {
            id: "aircraft-select",
            label: "Aircraft",
            firstOption: "Airbus A320",
            secondOption: "Boeing 737",
          },
        },
        {
          type: "AuthShell",
          props: {
            id: "sign-in-shell",
            eyebrow: "Welcome back",
            title: "Sign in",
            image: "/login.jpg",
            content: "Sign-in form placeholder",
          },
        },
        {
          type: "Form",
          props: {
            id: "email-form",
            inputLabel: "Email",
            placeholder: "name@example.com",
            submitLabel: "Continue",
          },
        },
        {
          type: "PermissionSelector",
          props: {
            id: "permissions",
            title: "Assign permissions",
            description: "Choose permissions",
            assignLabel: "Assign",
          },
        },
      ],
    });

    const output = ts.transpileModule(source, {
      compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
      reportDiagnostics: true,
    });
    expect(output.diagnostics).toEqual([]);
    expect(source).toContain("onUiButtonClick?: (componentId: string) => void");
    expect(source).toContain("onUiSelectChange?: (componentId: string, value: string) => void");
    expect(source).toContain("callbacks.onUiButtonClick?.(id)");
    expect(source).toContain('case "AuthShell"');
    expect(source).toContain('case "Form"');
    expect(source).toContain("callbacks.onFormSubmit?.(id");
    expect(source).toContain('case "PermissionSelector"');
    expect(source).toContain("callbacks.onPermissionAssign?.(id, permissions)");
    expect(source).toContain('from "@cristian9751/sky-portal-component-library"');
    expect(source).not.toContain("@puckeditor/core");
  });

  it("downloads the generated React component", () => {
    const originalCreateElement = document.createElement.bind(document);
    const click = vi.fn();
    const anchor = originalCreateElement("a");
    anchor.click = click;
    const createElement = vi.spyOn(document, "createElement").mockReturnValue(anchor);
    const createObjectURL = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:test");
    const revokeObjectURL = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

    downloadReactComponent({ root: { props: {} }, content: [] });

    expect(click).toHaveBeenCalledOnce();
    expect(anchor.download).toBe("PublishedPage.tsx");
    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:test");
    createElement.mockRestore();
    createObjectURL.mockRestore();
    revokeObjectURL.mockRestore();
  });
});
