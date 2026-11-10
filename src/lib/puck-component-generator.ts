export type PuckPageData = {
  root: { props?: Record<string, unknown> };
  content: Array<{ type: string; props: Record<string, unknown> }>;
};

const COMPONENT_LIBRARY = "@cristian9751/sky-portal-component-library";

export function generateReactComponent(data: PuckPageData): string {
  const rootTitle = data.root.props?.["title"];
  const pageTitle = typeof rootTitle === "string" ? rootTitle : "Published page";

  return `import type { ReactNode } from "react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
  AdminLTECard, Alert, AlertDescription, AlertTitle, AspectRatio, AuthShell,
  Avatar, AvatarFallback, AvatarImage, Badge, Button, Calendar,
  Card, CardContent, CardHeader, CardTitle, Checkbox, Collapsible,
  CollapsibleContent, CollapsibleTrigger, Input, Label, LangProvider,
  Progress, RadioGroup, RadioGroupItem, Separator, Select, SelectContent,
  SelectItem, SelectTrigger, SelectValue, Skeleton, Slider, SmallBox,
  Switch, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Tabs, TabsContent, TabsList, TabsTrigger, Textarea, Toggle,
  FormContainer, PermissionSelector,
} from "${COMPONENT_LIBRARY}";

type PageBlock = {
  type: string;
  props: Record<string, unknown>;
};

export type PublishedPageProps = {
  onUiButtonClick?: (componentId: string) => void;
  onUiInputChange?: (componentId: string, value: string) => void;
  onUiTextareaChange?: (componentId: string, value: string) => void;
  onUiCheckboxChange?: (componentId: string, checked: boolean) => void;
  onUiSwitchChange?: (componentId: string, checked: boolean) => void;
  onUiSliderChange?: (componentId: string, value: number[]) => void;
  onUiSelectChange?: (componentId: string, value: string) => void;
  onUiRadioGroupChange?: (componentId: string, value: string) => void;
  onUiToggleChange?: (componentId: string, pressed: boolean) => void;
  onUiTabsChange?: (componentId: string, value: string) => void;
  onUiAccordionChange?: (componentId: string, value: string | string[]) => void;
  onUiCollapsibleChange?: (componentId: string, open: boolean) => void;
  onUiCalendarSelect?: (componentId: string, date: Date | undefined) => void;
  onFormSubmit?: (componentId: string, value: string) => void;
  onPermissionAssign?: (componentId: string, permissions: string[]) => void;
};

const pageBlocks: PageBlock[] = ${JSON.stringify(data.content, null, 2)};
const pageTitle = ${JSON.stringify(pageTitle)};

function getText(block: PageBlock, key: string, fallback = ""): string {
  const value = block.props[key];
  return typeof value === "string" ? value : fallback;
}

function getNumber(block: PageBlock, key: string, fallback = 0): number {
  const value = block.props[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function getBoolean(block: PageBlock, key: string, fallback = false): boolean {
  const value = block.props[key];
  return typeof value === "boolean" ? value : fallback;
}

function getId(block: PageBlock): string {
  return getText(block, "id", block.type);
}

function renderBlock(block: PageBlock, callbacks: PublishedPageProps): ReactNode {
  const id = getId(block);

  switch (block.type) {
    case "HeadingBlock": {
      const text = getText(block, "text");
      const level = getText(block, "level", "h2");
      const Heading = level === "h1" || level === "h3" ? level : "h2";
      return <div key={id} className="col-12"><Heading>{text}</Heading></div>;
    }
    case "MetricBox":
      return <div key={id} className="col-12 col-md-4"><SmallBox label={getText(block, "label")} value={getText(block, "value")} icon={getText(block, "icon", "bi-airplane")} variant={getText(block, "variant", "primary")} /></div>;
    case "ContentCard":
      return <div key={id} className="col-12"><AdminLTECard title={getText(block, "title")} collapsible={false}><p className="mb-0">{getText(block, "body")}</p></AdminLTECard></div>;
    case "EventFeature": {
      const name = getText(block, "name");
      return <div key={id} className="col-12"><AdminLTECard title="Featured event" collapsible={false}><div className="row g-3 align-items-center"><div className="col-12 col-md-7"><h4>{name}</h4><p className="mb-0 text-muted">{getText(block, "description")}</p></div><div className="col-12 col-md-5"><img src={getText(block, "imageUrl")} alt={getText(block, "imageAlt", name)} className="dashboard-event-image" /></div></div></AdminLTECard></div>;
    }
    case "AuthShell":
      return <AuthShell key={id} eyebrow={getText(block, "eyebrow")} title={getText(block, "title")} image={getText(block, "image")}><p>{getText(block, "content")}</p></AuthShell>;
    case "Form":
      return <FormContainer key={id} className="space-y-5" onSubmit={(event) => { event.preventDefault(); const value = new FormData(event.currentTarget).get("value"); callbacks.onFormSubmit?.(id, typeof value === "string" ? value : ""); }}><div className="space-y-2"><Label>{getText(block, "inputLabel", "Email")}</Label><Input name="value" placeholder={getText(block, "placeholder")} /></div><Button type="submit">{getText(block, "submitLabel", "Submit")}</Button></FormContainer>;
    case "PermissionSelector":
      return <div key={id} className="col-12"><PermissionSelector title={getText(block, "title", "Assign permissions")} description={getText(block, "description", "Select the permissions you want to assign.")} assignLabel={getText(block, "assignLabel", "Assign")} onAssign={(permissions) => callbacks.onPermissionAssign?.(id, permissions)} /></div>;
    case "UiButton":
      return <div key={id} className="col-12"><Button variant={getText(block, "variant", "default") as "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"} size={getText(block, "size", "default") as "default" | "sm" | "lg"} onClick={() => callbacks.onUiButtonClick?.(id)}>{getText(block, "label", "Button")}</Button></div>;
    case "UiBadge":
      return <div key={id} className="col-12"><Badge variant={getText(block, "variant", "default") as "default" | "secondary" | "destructive" | "outline"}>{getText(block, "label")}</Badge></div>;
    case "UiAlert":
      return <div key={id} className="col-12"><Alert variant={getText(block, "variant", "default") as "default" | "destructive"}><AlertTitle>{getText(block, "title")}</AlertTitle><AlertDescription>{getText(block, "description")}</AlertDescription></Alert></div>;
    case "UiCard":
      return <div key={id} className="col-12 col-md-6"><Card><CardHeader><CardTitle>{getText(block, "title")}</CardTitle><p className="text-sm text-muted-foreground">{getText(block, "description")}</p></CardHeader><CardContent>{getText(block, "body")}</CardContent></Card></div>;
    case "UiAvatar":
      return <div key={id} className="col-12"><Avatar><AvatarImage src={getText(block, "imageUrl")} alt={getText(block, "alt")} /><AvatarFallback>{getText(block, "fallback", "AS")}</AvatarFallback></Avatar></div>;
    case "UiProgress":
      return <div key={id} className="col-12 col-md-6"><div className="mb-2 flex justify-between text-sm"><span>{getText(block, "label")}</span><span>{getNumber(block, "value")}%</span></div><Progress value={Math.min(100, Math.max(0, getNumber(block, "value")))} /></div>;
    case "UiInput":
      return <div key={id} className="col-12 col-md-6"><Label className="mb-2 block">{getText(block, "label")}</Label><Input type={getText(block, "type", "text") as "text" | "email" | "number"} placeholder={getText(block, "placeholder")} onChange={(event) => callbacks.onUiInputChange?.(id, event.currentTarget.value)} /></div>;
    case "UiTextarea":
      return <div key={id} className="col-12 col-md-6"><Label className="mb-2 block">{getText(block, "label")}</Label><Textarea placeholder={getText(block, "placeholder")} onChange={(event) => callbacks.onUiTextareaChange?.(id, event.currentTarget.value)} /></div>;
    case "UiSeparator":
      return <div key={id} className="col-12">{getText(block, "orientation") === "vertical" ? <div className="flex h-16 items-center"><Separator orientation="vertical" /></div> : <Separator />}</div>;
    case "UiTabs":
      return <div key={id} className="col-12"><Tabs defaultValue="first" onValueChange={(value) => callbacks.onUiTabsChange?.(id, value)}><TabsList><TabsTrigger value="first">{getText(block, "firstTab")}</TabsTrigger><TabsTrigger value="second">{getText(block, "secondTab")}</TabsTrigger></TabsList><TabsContent value="first" className="p-3">{getText(block, "firstContent")}</TabsContent><TabsContent value="second" className="p-3">{getText(block, "secondContent")}</TabsContent></Tabs></div>;
    case "UiAccordion":
      return <div key={id} className="col-12"><Accordion type="single" collapsible defaultValue="item" onValueChange={(value) => callbacks.onUiAccordionChange?.(id, value)}><AccordionItem value="item"><AccordionTrigger>{getText(block, "title")}</AccordionTrigger><AccordionContent>{getText(block, "body")}</AccordionContent></AccordionItem></Accordion></div>;
    case "UiTable":
      return <div key={id} className="col-12"><Table><TableHeader><TableRow><TableHead>Flight</TableHead><TableHead>Route</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>{getText(block, "firstFlight")}</TableCell><TableCell>{getText(block, "firstRoute")}</TableCell></TableRow><TableRow><TableCell>{getText(block, "secondFlight")}</TableCell><TableCell>{getText(block, "secondRoute")}</TableCell></TableRow></TableBody></Table></div>;
    case "UiSkeleton":
      return <div key={id} className="col-12"><Skeleton style={{ width: getNumber(block, "width", 320), height: getNumber(block, "height", 20) }} /></div>;
    case "UiCheckbox":
      return <div key={id} className="col-12 flex items-center gap-2"><Checkbox defaultChecked={getBoolean(block, "checked")} onCheckedChange={(checked) => callbacks.onUiCheckboxChange?.(id, checked === true)} /><Label>{getText(block, "label")}</Label></div>;
    case "UiSwitch":
      return <div key={id} className="col-12 flex items-center gap-2"><Switch defaultChecked={getBoolean(block, "checked")} onCheckedChange={(checked) => callbacks.onUiSwitchChange?.(id, checked)} /><Label>{getText(block, "label")}</Label></div>;
    case "UiSlider": {
      const min = getNumber(block, "min");
      const max = Math.max(min, getNumber(block, "max", 100));
      const value = Math.min(max, Math.max(min, getNumber(block, "value")));
      return <div key={id} className="col-12 col-md-6"><Label className="mb-3 block">{getText(block, "label")}: {value}</Label><Slider defaultValue={[value]} min={min} max={max} step={Math.max(1, getNumber(block, "step", 1))} onValueChange={(next) => callbacks.onUiSliderChange?.(id, next)} /></div>;
    }
    case "UiAspectRatio":
      return <div key={id} className="col-12 col-md-6"><AspectRatio ratio={getNumber(block, "ratio", 16 / 9)}><img src={getText(block, "imageUrl")} alt={getText(block, "alt")} className="h-full w-full rounded-md object-cover" /></AspectRatio></div>;
    case "UiCalendar":
      return <div key={id} className="col-12 col-md-6"><Calendar mode="single" showOutsideDays={getBoolean(block, "showOutsideDays", true)} onSelect={(date) => callbacks.onUiCalendarSelect?.(id, date)} /></div>;
    case "UiRadioGroup":
      return <div key={id} className="col-12"><Label className="mb-2 block">{getText(block, "label")}</Label><RadioGroup defaultValue="first" onValueChange={(value) => callbacks.onUiRadioGroupChange?.(id, value)}><div className="flex items-center gap-2"><RadioGroupItem value="first" id={id + "-first"} /><Label htmlFor={id + "-first"}>{getText(block, "firstOption")}</Label></div><div className="flex items-center gap-2"><RadioGroupItem value="second" id={id + "-second"} /><Label htmlFor={id + "-second"}>{getText(block, "secondOption")}</Label></div></RadioGroup></div>;
    case "UiSelect":
      return <div key={id} className="col-12 col-md-6"><Label className="mb-2 block">{getText(block, "label")}</Label><Select defaultValue="first" onValueChange={(value) => callbacks.onUiSelectChange?.(id, value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="first">{getText(block, "firstOption")}</SelectItem><SelectItem value="second">{getText(block, "secondOption")}</SelectItem></SelectContent></Select></div>;
    case "UiCollapsible":
      return <div key={id} className="col-12"><Collapsible defaultOpen onOpenChange={(open) => callbacks.onUiCollapsibleChange?.(id, open)}><CollapsibleTrigger className="font-medium">{getText(block, "title")}</CollapsibleTrigger><CollapsibleContent className="pt-2 text-muted-foreground">{getText(block, "body")}</CollapsibleContent></Collapsible></div>;
    case "UiToggle":
      return <div key={id} className="col-12"><Toggle defaultPressed={getBoolean(block, "pressed")} aria-label={getText(block, "label")} onPressedChange={(pressed) => callbacks.onUiToggleChange?.(id, pressed)}>{getText(block, "label")}</Toggle></div>;
    default:
      return null;
  }
}

export default function PublishedPage(callbacks: PublishedPageProps) {
  return (
    <LangProvider>
      <main className="container-fluid py-4">
        <h1 className="mb-4">{pageTitle}</h1>
        <div className="row g-3">
          {pageBlocks.map((block) => renderBlock(block, callbacks))}
        </div>
      </main>
    </LangProvider>
  );
}
`;
}

export function downloadReactComponent(data: PuckPageData): void {
  const source = generateReactComponent(data);
  const file = new Blob([source], { type: "text/typescript;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "PublishedPage.tsx";
  link.click();
  URL.revokeObjectURL(url);
}
