import { useRef, useState } from "react";
import { Puck, Render, type Config, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import "../styles.css";
import "../custom-adminlte.scss";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { AuthShell } from "@/components/AuthShell";
import AdminLTECard from "@/components/dashboard/Card";
import SmallBox from "@/components/dashboard/SmallBox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { FormContainer } from "@/components/ui/form-container";
import { PermissionSelector } from "@/components/ui/permission-selector";
import { downloadReactComponent } from "@/lib/puck-component-generator";

type MetricBoxProps = {
  label: string;
  value: string;
  icon: string;
  variant: string;
};

type ContentCardProps = {
  title: string;
  body: string;
};

type EventFeatureProps = {
  name: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
};

type HeadingProps = {
  text: string;
  level: "h1" | "h2" | "h3";
};

type ButtonBlockProps = {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
  size: "default" | "sm" | "lg";
};

type BadgeBlockProps = {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
};

type AlertBlockProps = {
  title: string;
  description: string;
  variant: "default" | "destructive";
};

type UiCardBlockProps = {
  title: string;
  description: string;
  body: string;
};

type AvatarBlockProps = {
  imageUrl: string;
  alt: string;
  fallback: string;
};

type ProgressBlockProps = {
  label: string;
  value: number;
};

type InputBlockProps = {
  label: string;
  placeholder: string;
  type: "text" | "email" | "number";
};

type TextareaBlockProps = {
  label: string;
  placeholder: string;
};

type SeparatorBlockProps = {
  orientation: "horizontal" | "vertical";
};

type TabsBlockProps = {
  firstTab: string;
  firstContent: string;
  secondTab: string;
  secondContent: string;
};

type AccordionBlockProps = {
  title: string;
  body: string;
};

type TableBlockProps = {
  firstFlight: string;
  firstRoute: string;
  secondFlight: string;
  secondRoute: string;
};

type SkeletonBlockProps = {
  width: number;
  height: number;
};

type CheckboxBlockProps = {
  label: string;
  checked: boolean;
};

type SwitchBlockProps = {
  label: string;
  checked: boolean;
};

type SliderBlockProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
};

type AspectRatioBlockProps = {
  imageUrl: string;
  alt: string;
  ratio: number;
};

type CalendarBlockProps = {
  showOutsideDays: boolean;
};

type RadioGroupBlockProps = {
  label: string;
  firstOption: string;
  secondOption: string;
};

type SelectBlockProps = {
  label: string;
  firstOption: string;
  secondOption: string;
};

type CollapsibleBlockProps = {
  title: string;
  body: string;
};

type ToggleBlockProps = {
  label: string;
  pressed: boolean;
};

type AuthShellBlockProps = {
  eyebrow: string;
  title: string;
  image: string;
  content: string;
};

type FormBlockProps = {
  inputLabel: string;
  placeholder: string;
  submitLabel: string;
};

type PermissionSelectorBlockProps = {
  title: string;
  description: string;
  assignLabel: string;
};

type LibraryEditorComponents = {
  HeadingBlock: HeadingProps;
  MetricBox: MetricBoxProps;
  ContentCard: ContentCardProps;
  EventFeature: EventFeatureProps;
  UiButton: ButtonBlockProps;
  UiBadge: BadgeBlockProps;
  UiAlert: AlertBlockProps;
  UiCard: UiCardBlockProps;
  UiAvatar: AvatarBlockProps;
  UiProgress: ProgressBlockProps;
  UiInput: InputBlockProps;
  UiTextarea: TextareaBlockProps;
  UiSeparator: SeparatorBlockProps;
  UiTabs: TabsBlockProps;
  UiAccordion: AccordionBlockProps;
  UiTable: TableBlockProps;
  UiSkeleton: SkeletonBlockProps;
  UiCheckbox: CheckboxBlockProps;
  UiSwitch: SwitchBlockProps;
  UiSlider: SliderBlockProps;
  UiAspectRatio: AspectRatioBlockProps;
  UiCalendar: CalendarBlockProps;
  UiRadioGroup: RadioGroupBlockProps;
  UiSelect: SelectBlockProps;
  UiCollapsible: CollapsibleBlockProps;
  UiToggle: ToggleBlockProps;
  AuthShell: AuthShellBlockProps;
  Form: FormBlockProps;
  PermissionSelector: PermissionSelectorBlockProps;
};

type EditorData = Data<LibraryEditorComponents, { title?: string }>;

const STORAGE_KEY = "sky-portal-library:puck-page";

const editorConfig: Config<LibraryEditorComponents, { title: string }> = {
  categories: {
    layout: {
      title: "Page content",
      components: ["HeadingBlock", "ContentCard", "EventFeature"],
    },
    dashboard: {
      title: "Dashboard components",
      components: ["MetricBox"],
    },
    authentication: {
      title: "Authentication components",
      components: ["AuthShell", "Form"],
    },
    ui: {
      title: "Library UI components",
      components: [
        "UiButton",
        "UiBadge",
        "UiAlert",
        "UiCard",
        "UiAvatar",
        "UiProgress",
        "UiInput",
        "UiTextarea",
        "UiSeparator",
        "UiTabs",
        "UiAccordion",
        "UiTable",
        "UiSkeleton",
        "UiCheckbox",
        "UiSwitch",
        "UiSlider",
        "UiAspectRatio",
        "UiCalendar",
        "UiRadioGroup",
        "UiSelect",
        "UiCollapsible",
        "UiToggle",
        "PermissionSelector",
      ],
    },
  },
  root: {
    fields: {
      title: { type: "text", label: "Page title" },
    },
    defaultProps: {
      title: "Crew dashboard",
    },
    render: ({ children, title }) => (
      <main className="container-fluid py-4">
        <h1 className="mb-4">{title}</h1>
        <div className="row g-3">{children}</div>
      </main>
    ),
  },
  components: {
    HeadingBlock: {
      label: "Heading",
      fields: {
        text: { type: "text", label: "Text" },
        level: {
          type: "select",
          label: "Heading level",
          options: [
            { label: "Large", value: "h1" },
            { label: "Medium", value: "h2" },
            { label: "Small", value: "h3" },
          ],
        },
      },
      defaultProps: {
        text: "Welcome to your dashboard",
        level: "h2" as const,
      },
      render: ({ text, level }) => {
        const Heading = level;
        return (
          <div className="col-12">
            <Heading>{text}</Heading>
          </div>
        );
      },
    },
    MetricBox: {
      label: "AdminLTE metric box",
      fields: {
        label: { type: "text", label: "Label" },
        value: { type: "text", label: "Value" },
        icon: { type: "text", label: "Bootstrap icon class" },
        variant: {
          type: "select",
          label: "Color",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Info", value: "info" },
            { label: "Success", value: "success" },
          ],
        },
      },
      defaultProps: {
        label: "Flights",
        value: "128",
        icon: "bi-airplane",
        variant: "primary",
      },
      render: ({ label, value, icon, variant }) => (
        <div className="col-12 col-md-4">
          <SmallBox label={label} value={value} icon={icon} variant={variant} />
        </div>
      ),
    },
    ContentCard: {
      label: "AdminLTE card",
      fields: {
        title: { type: "text", label: "Title" },
        body: { type: "textarea", label: "Content" },
      },
      defaultProps: {
        title: "Flight activity",
        body: "Review your latest flights and crew activity here.",
      },
      render: ({ title, body }) => (
        <div className="col-12">
          <AdminLTECard title={title} collapsible={false}>
            <p className="mb-0">{body}</p>
          </AdminLTECard>
        </div>
      ),
    },
    EventFeature: {
      label: "Event feature",
      fields: {
        name: { type: "text", label: "Event name" },
        description: { type: "textarea", label: "Description" },
        imageUrl: { type: "text", label: "Image URL" },
        imageAlt: { type: "text", label: "Image description" },
      },
      defaultProps: {
        name: "Island tour",
        description: "Join the community for a scenic group flight across the islands.",
        imageUrl:
          "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "View of the sky from an airplane",
      },
      render: ({ name, description, imageUrl, imageAlt }) => (
        <div className="col-12">
          <AdminLTECard title="Featured event" collapsible={false}>
            <div className="row g-3 align-items-center">
              <div className="col-12 col-md-7">
                <h4>{name}</h4>
                <p className="mb-0 text-muted">{description}</p>
              </div>
              <div className="col-12 col-md-5">
                <img src={imageUrl} alt={imageAlt || name} className="dashboard-event-image" />
              </div>
            </div>
          </AdminLTECard>
        </div>
      ),
    },
    AuthShell: {
      label: "Authentication shell",
      fields: {
        eyebrow: { type: "text", label: "Eyebrow" },
        title: { type: "text", label: "Title" },
        image: { type: "text", label: "Image URL" },
        content: { type: "textarea", label: "Content" },
      },
      defaultProps: {
        eyebrow: "Welcome back",
        title: "Sign in to your account",
        image:
          "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
        content: "Your sign-in form goes here.",
      },
      render: ({ eyebrow, title, image, content }) => (
        <AuthShell eyebrow={eyebrow} title={title} image={image}>
          <p>{content}</p>
        </AuthShell>
      ),
    },
    Form: {
      label: "Form",
      fields: {
        inputLabel: { type: "text", label: "Input label" },
        placeholder: { type: "text", label: "Placeholder" },
        submitLabel: { type: "text", label: "Submit button text" },
      },
      defaultProps: {
        inputLabel: "Email",
        placeholder: "name@example.com",
        submitLabel: "Submit",
      },
      render: ({ inputLabel, placeholder, submitLabel }) => (
        <FormContainer onSubmit={(event) => event.preventDefault()} className="space-y-5">
          <div className="space-y-2">
            <Label>{inputLabel}</Label>
            <Input name="value" placeholder={placeholder} />
          </div>
          <Button type="submit">{submitLabel}</Button>
        </FormContainer>
      ),
    },
    UiButton: {
      label: "Button",
      fields: {
        label: { type: "text", label: "Button text" },
        variant: {
          type: "select",
          label: "Variant",
          options: [
            { label: "Default", value: "default" },
            { label: "Secondary", value: "secondary" },
            { label: "Destructive", value: "destructive" },
            { label: "Outline", value: "outline" },
            { label: "Ghost", value: "ghost" },
            { label: "Link", value: "link" },
          ],
        },
        size: {
          type: "select",
          label: "Size",
          options: [
            { label: "Default", value: "default" },
            { label: "Small", value: "sm" },
            { label: "Large", value: "lg" },
          ],
        },
      },
      defaultProps: { label: "Continue", variant: "default", size: "default" },
      render: ({ label, variant, size }) => (
        <div className="col-12">
          <Button variant={variant} size={size}>
            {label}
          </Button>
        </div>
      ),
    },
    UiBadge: {
      label: "Badge",
      fields: {
        label: { type: "text", label: "Badge text" },
        variant: {
          type: "select",
          label: "Variant",
          options: [
            { label: "Default", value: "default" },
            { label: "Secondary", value: "secondary" },
            { label: "Destructive", value: "destructive" },
            { label: "Outline", value: "outline" },
          ],
        },
      },
      defaultProps: { label: "Active", variant: "default" },
      render: ({ label, variant }) => (
        <div className="col-12">
          <Badge variant={variant}>{label}</Badge>
        </div>
      ),
    },
    UiAlert: {
      label: "Alert",
      fields: {
        title: { type: "text", label: "Title" },
        description: { type: "textarea", label: "Description" },
        variant: {
          type: "select",
          label: "Variant",
          options: [
            { label: "Default", value: "default" },
            { label: "Destructive", value: "destructive" },
          ],
        },
      },
      defaultProps: {
        title: "Flight plan saved",
        description: "Your changes have been saved successfully.",
        variant: "default",
      },
      render: ({ title, description, variant }) => (
        <div className="col-12">
          <Alert variant={variant}>
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
          </Alert>
        </div>
      ),
    },
    UiCard: {
      label: "Card",
      fields: {
        title: { type: "text", label: "Title" },
        description: { type: "text", label: "Description" },
        body: { type: "textarea", label: "Content" },
      },
      defaultProps: {
        title: "Flight plan",
        description: "Madrid to Barcelona",
        body: "Airbus A320 · Estimated duration 1h 15m",
      },
      render: ({ title, description, body }) => (
        <div className="col-12 col-md-6">
          <Card>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <p className="text-sm text-muted-foreground">{description}</p>
            </CardHeader>
            <CardContent>{body}</CardContent>
          </Card>
        </div>
      ),
    },
    UiAvatar: {
      label: "Avatar",
      fields: {
        imageUrl: { type: "text", label: "Image URL" },
        alt: { type: "text", label: "Image description" },
        fallback: { type: "text", label: "Fallback initials" },
      },
      defaultProps: {
        imageUrl: "https://air-spain.es/imagenes/va.png",
        alt: "Air Spain",
        fallback: "AS",
      },
      render: ({ imageUrl, alt, fallback }) => (
        <div className="col-12">
          <Avatar>
            <AvatarImage src={imageUrl} alt={alt} />
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
        </div>
      ),
    },
    UiProgress: {
      label: "Progress",
      fields: {
        label: { type: "text", label: "Label" },
        value: { type: "number", label: "Progress value", min: 0, max: 100 },
      },
      defaultProps: { label: "Training progress", value: 72 },
      render: ({ label, value }) => (
        <div className="col-12 col-md-6">
          <div className="mb-2 flex justify-between text-sm">
            <span>{label}</span>
            <span>{value}%</span>
          </div>
          <Progress value={Math.min(100, Math.max(0, value))} />
        </div>
      ),
    },
    UiInput: {
      label: "Input",
      fields: {
        label: { type: "text", label: "Label" },
        placeholder: { type: "text", label: "Placeholder" },
        type: {
          type: "select",
          label: "Input type",
          options: [
            { label: "Text", value: "text" },
            { label: "Email", value: "email" },
            { label: "Number", value: "number" },
          ],
        },
      },
      defaultProps: { label: "Pilot name", placeholder: "Enter a name", type: "text" },
      render: ({ label, placeholder, type }) => (
        <div className="col-12 col-md-6">
          <Label className="mb-2 block">{label}</Label>
          <Input type={type} placeholder={placeholder} />
        </div>
      ),
    },
    UiTextarea: {
      label: "Textarea",
      fields: {
        label: { type: "text", label: "Label" },
        placeholder: { type: "text", label: "Placeholder" },
      },
      defaultProps: { label: "Flight notes", placeholder: "Add notes..." },
      render: ({ label, placeholder }) => (
        <div className="col-12 col-md-6">
          <Label className="mb-2 block">{label}</Label>
          <Textarea placeholder={placeholder} />
        </div>
      ),
    },
    UiSeparator: {
      label: "Separator",
      fields: {
        orientation: {
          type: "select",
          label: "Orientation",
          options: [
            { label: "Horizontal", value: "horizontal" },
            { label: "Vertical", value: "vertical" },
          ],
        },
      },
      defaultProps: { orientation: "horizontal" },
      render: ({ orientation }) => (
        <div className="col-12">
          {orientation === "vertical" ? (
            <div className="flex h-16 items-center">
              <Separator orientation="vertical" />
            </div>
          ) : (
            <Separator />
          )}
        </div>
      ),
    },
    UiTabs: {
      label: "Tabs",
      fields: {
        firstTab: { type: "text", label: "First tab title" },
        firstContent: { type: "textarea", label: "First tab content" },
        secondTab: { type: "text", label: "Second tab title" },
        secondContent: { type: "textarea", label: "Second tab content" },
      },
      defaultProps: {
        firstTab: "Overview",
        firstContent: "Flight overview and latest updates.",
        secondTab: "Crew",
        secondContent: "Crew members assigned to this flight.",
      },
      render: ({ firstTab, firstContent, secondTab, secondContent }) => (
        <div className="col-12">
          <Tabs defaultValue="first">
            <TabsList>
              <TabsTrigger value="first">{firstTab}</TabsTrigger>
              <TabsTrigger value="second">{secondTab}</TabsTrigger>
            </TabsList>
            <TabsContent value="first" className="p-3">
              {firstContent}
            </TabsContent>
            <TabsContent value="second" className="p-3">
              {secondContent}
            </TabsContent>
          </Tabs>
        </div>
      ),
    },
    UiAccordion: {
      label: "Accordion",
      fields: {
        title: { type: "text", label: "Title" },
        body: { type: "textarea", label: "Content" },
      },
      defaultProps: { title: "Flight details", body: "Departure from Madrid at 09:30 UTC." },
      render: ({ title, body }) => (
        <div className="col-12">
          <Accordion type="single" collapsible defaultValue="item">
            <AccordionItem value="item">
              <AccordionTrigger>{title}</AccordionTrigger>
              <AccordionContent>{body}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
    },
    UiTable: {
      label: "Table",
      fields: {
        firstFlight: { type: "text", label: "First flight" },
        firstRoute: { type: "text", label: "First route" },
        secondFlight: { type: "text", label: "Second flight" },
        secondRoute: { type: "text", label: "Second route" },
      },
      defaultProps: {
        firstFlight: "IBE204",
        firstRoute: "LEMD → LEBL",
        secondFlight: "IBE512",
        secondRoute: "LEMD → GCTS",
      },
      render: ({ firstFlight, firstRoute, secondFlight, secondRoute }) => (
        <div className="col-12">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flight</TableHead>
                <TableHead>Route</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{firstFlight}</TableCell>
                <TableCell>{firstRoute}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{secondFlight}</TableCell>
                <TableCell>{secondRoute}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ),
    },
    UiSkeleton: {
      label: "Skeleton",
      fields: {
        width: { type: "number", label: "Width (px)", min: 40, max: 800 },
        height: { type: "number", label: "Height (px)", min: 8, max: 300 },
      },
      defaultProps: { width: 320, height: 20 },
      render: ({ width, height }) => (
        <div className="col-12">
          <Skeleton style={{ width, height }} />
        </div>
      ),
    },
    UiCheckbox: {
      label: "Checkbox",
      fields: {
        label: { type: "text", label: "Label" },
        checked: {
          type: "radio",
          label: "Checked by default",
          options: [
            { label: "Checked", value: true },
            { label: "Unchecked", value: false },
          ],
        },
      },
      defaultProps: { label: "Remember this device", checked: true },
      render: ({ label, checked }) => (
        <div className="col-12 flex items-center gap-2">
          <Checkbox checked={checked} onCheckedChange={() => {}} />
          <Label>{label}</Label>
        </div>
      ),
    },
    UiSwitch: {
      label: "Switch",
      fields: {
        label: { type: "text", label: "Label" },
        checked: {
          type: "radio",
          label: "Enabled by default",
          options: [
            { label: "Enabled", value: true },
            { label: "Disabled", value: false },
          ],
        },
      },
      defaultProps: { label: "Enable notifications", checked: true },
      render: ({ label, checked }) => (
        <div className="col-12 flex items-center gap-2">
          <Switch checked={checked} onCheckedChange={() => {}} />
          <Label>{label}</Label>
        </div>
      ),
    },
    UiSlider: {
      label: "Slider",
      fields: {
        label: { type: "text", label: "Label" },
        value: { type: "number", label: "Default value", min: 0, max: 100 },
        min: { type: "number", label: "Minimum" },
        max: { type: "number", label: "Maximum" },
        step: { type: "number", label: "Step", min: 1 },
      },
      defaultProps: { label: "Cruise altitude", value: 60, min: 0, max: 100, step: 1 },
      render: ({ label, value, min, max, step }) => (
        <div className="col-12 col-md-6">
          <Label className="mb-3 block">
            {label}: {value}
          </Label>
          <Slider defaultValue={[value]} min={min} max={max} step={step} />
        </div>
      ),
    },
    UiAspectRatio: {
      label: "Aspect ratio image",
      fields: {
        imageUrl: { type: "text", label: "Image URL" },
        alt: { type: "text", label: "Image description" },
        ratio: { type: "number", label: "Width / height ratio", min: 0.5, max: 3, step: 0.1 },
      },
      defaultProps: {
        imageUrl:
          "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
        alt: "Airplane above the clouds",
        ratio: 16 / 9,
      },
      render: ({ imageUrl, alt, ratio }) => (
        <div className="col-12 col-md-6">
          <AspectRatio ratio={ratio}>
            <img src={imageUrl} alt={alt} className="h-full w-full rounded-md object-cover" />
          </AspectRatio>
        </div>
      ),
    },
    UiCalendar: {
      label: "Calendar",
      fields: {
        showOutsideDays: {
          type: "radio",
          label: "Show days outside the month",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
      defaultProps: { showOutsideDays: true },
      render: ({ showOutsideDays }) => (
        <div className="col-12 col-md-6">
          <Calendar
            mode="single"
            defaultMonth={new Date(2026, 0)}
            showOutsideDays={showOutsideDays}
          />
        </div>
      ),
    },
    UiRadioGroup: {
      label: "Radio group",
      fields: {
        label: { type: "text", label: "Group label" },
        firstOption: { type: "text", label: "First option" },
        secondOption: { type: "text", label: "Second option" },
      },
      defaultProps: {
        label: "Aircraft class",
        firstOption: "Short haul",
        secondOption: "Long haul",
      },
      render: ({ label, firstOption, secondOption }) => (
        <div className="col-12">
          <Label className="mb-2 block">{label}</Label>
          <RadioGroup defaultValue="first">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="first" id="puck-radio-first" />
              <Label htmlFor="puck-radio-first">{firstOption}</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="second" id="puck-radio-second" />
              <Label htmlFor="puck-radio-second">{secondOption}</Label>
            </div>
          </RadioGroup>
        </div>
      ),
    },
    UiSelect: {
      label: "Select",
      fields: {
        label: { type: "text", label: "Label" },
        firstOption: { type: "text", label: "First option" },
        secondOption: { type: "text", label: "Second option" },
      },
      defaultProps: { label: "Aircraft", firstOption: "Airbus A320", secondOption: "Boeing 737" },
      render: ({ label, firstOption, secondOption }) => (
        <div className="col-12 col-md-6">
          <Label className="mb-2 block">{label}</Label>
          <Select defaultValue="first">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="first">{firstOption}</SelectItem>
              <SelectItem value="second">{secondOption}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ),
    },
    UiCollapsible: {
      label: "Collapsible",
      fields: {
        title: { type: "text", label: "Trigger text" },
        body: { type: "textarea", label: "Content" },
      },
      defaultProps: {
        title: "Flight notes",
        body: "Cruise at FL350. Estimated arrival 11:15 UTC.",
      },
      render: ({ title, body }) => (
        <div className="col-12">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="font-medium">{title}</CollapsibleTrigger>
            <CollapsibleContent className="pt-2 text-muted-foreground">{body}</CollapsibleContent>
          </Collapsible>
        </div>
      ),
    },
    UiToggle: {
      label: "Toggle",
      fields: {
        label: { type: "text", label: "Button text" },
        pressed: {
          type: "radio",
          label: "Pressed by default",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      },
      defaultProps: { label: "Favorite", pressed: false },
      render: ({ label, pressed }) => (
        <div className="col-12">
          <Toggle defaultPressed={pressed} aria-label={label}>
            {label}
          </Toggle>
        </div>
      ),
    },
    PermissionSelector: {
      label: "Permission selector",
      fields: {
        title: { type: "text", label: "Title" },
        description: { type: "textarea", label: "Description" },
        assignLabel: { type: "text", label: "Assign button label" },
      },
      defaultProps: {
        title: "Assign permissions",
        description: "Select the permissions you want to assign.",
        assignLabel: "Assign",
      },
      render: ({ title, description, assignLabel }) => (
        <div className="col-12">
          <PermissionSelector
            title={title}
            description={description}
            assignLabel={assignLabel}
            onAssign={() => {}}
          />
        </div>
      ),
    },
  },
};

const defaultData: EditorData = {
  root: {
    props: { title: "Crew dashboard" },
  },
  content: [
    {
      type: "HeadingBlock",
      props: { id: "welcome-heading", text: "Welcome to your dashboard", level: "h2" },
    },
    {
      type: "MetricBox",
      props: {
        id: "metric-flights",
        label: "Flights",
        value: "128",
        icon: "bi-airplane",
        variant: "primary",
      },
    },
    {
      type: "MetricBox",
      props: {
        id: "metric-hours",
        label: "Flight hours",
        value: "246 h",
        icon: "bi-clock-history",
        variant: "secondary",
      },
    },
    {
      type: "MetricBox",
      props: {
        id: "metric-landings",
        label: "Landing average",
        value: "−320 ft/min",
        icon: "bi-bullseye",
        variant: "info",
      },
    },
    {
      type: "ContentCard",
      props: {
        id: "activity-card",
        title: "Flight activity",
        body: "Review your latest flights and crew activity here.",
      },
    },
    {
      type: "EventFeature",
      props: {
        id: "featured-event",
        name: "Island tour",
        description: "Join the community for a scenic group flight across the islands.",
        imageUrl:
          "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "View of the sky from an airplane",
      },
    },
    {
      type: "UiButton",
      props: { id: "ui-button", label: "Book a flight", variant: "default", size: "default" },
    },
    {
      type: "UiBadge",
      props: { id: "ui-badge", label: "Flight confirmed", variant: "secondary" },
    },
    {
      type: "UiAlert",
      props: {
        id: "ui-alert",
        title: "Flight plan saved",
        description: "Your changes have been saved successfully.",
        variant: "default",
      },
    },
    {
      type: "UiCard",
      props: {
        id: "ui-card",
        title: "Flight plan",
        description: "Madrid to Barcelona",
        body: "Airbus A320 · Estimated duration 1h 15m",
      },
    },
    {
      type: "UiProgress",
      props: { id: "ui-progress", label: "Training progress", value: 72 },
    },
    {
      type: "UiTabs",
      props: {
        id: "ui-tabs",
        firstTab: "Overview",
        firstContent: "Flight overview and latest updates.",
        secondTab: "Crew",
        secondContent: "Crew members assigned to this flight.",
      },
    },
    {
      type: "UiAccordion",
      props: {
        id: "ui-accordion",
        title: "Flight details",
        body: "Departure from Madrid at 09:30 UTC.",
      },
    },
    {
      type: "UiTable",
      props: {
        id: "ui-table",
        firstFlight: "IBE204",
        firstRoute: "LEMD → LEBL",
        secondFlight: "IBE512",
        secondRoute: "LEMD → GCTS",
      },
    },
  ],
};

function isEditorData(value: unknown): value is EditorData {
  return (
    typeof value === "object" &&
    value !== null &&
    "root" in value &&
    typeof value.root === "object" &&
    value.root !== null &&
    "content" in value &&
    Array.isArray(value.content)
  );
}

function readSavedData(): { data: EditorData; error?: string } {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { data: defaultData };

    const parsed: unknown = JSON.parse(saved);
    if (!isEditorData(parsed)) {
      return {
        data: defaultData,
        error: "Saved page data has an invalid format. Reset it to continue.",
      };
    }

    return { data: parsed };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown storage error";
    return { data: defaultData, error: `Could not read the saved page: ${message}` };
  }
}

function saveData(data: EditorData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function downloadData(data: EditorData) {
  const file = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "sky-portal-page.json";
  link.click();
  URL.revokeObjectURL(url);
}

export const PuckEditor = () => {
  const [savedPage] = useState(readSavedData);
  const [saveMessage, setSaveMessage] = useState("Drafts save automatically in this browser.");
  const [saveError, setSaveError] = useState<string>();
  const currentData = useRef(savedPage.data);

  const handleChange = (data: EditorData) => {
    currentData.current = data;
    try {
      saveData(data);
      setSaveError(undefined);
      setSaveMessage("Draft saved locally.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown storage error";
      setSaveError(`Could not save the draft: ${message}`);
    }
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown storage error";
      setSaveError(`Could not reset the draft: ${message}`);
    }
  };

  const handleExport = () => {
    try {
      downloadData(currentData.current);
      setSaveError(undefined);
      setSaveMessage("Page JSON exported.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown export error";
      setSaveError(`Could not export the page: ${message}`);
    }
  };

  const handlePublish = (data: EditorData) => {
    handleChange(data);
    try {
      downloadReactComponent(data);
      setSaveError(undefined);
      setSaveMessage("React component downloaded as PublishedPage.tsx.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown publish error";
      setSaveError(`Could not generate the React component: ${message}`);
    }
  };

  return (
    <div className="puck-local-editor">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 p-3">
        <div>
          <h1 className="h4 mb-1">Local page editor</h1>
          <p className="mb-0 text-muted">
            Compose pages with this library’s AdminLTE components. Changes stay in this browser.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={handleExport}>
            Export JSON
          </button>
          <button type="button" className="btn btn-outline-danger" onClick={handleReset}>
            Reset draft
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handlePublish(currentData.current)}
          >
            Publish React component
          </button>
        </div>
      </div>
      {savedPage.error && <p className="alert alert-warning mx-3">{savedPage.error}</p>}
      {saveError ? (
        <p className="alert alert-danger mx-3" role="alert">
          {saveError}
        </p>
      ) : (
        <p className="px-3 text-muted" role="status">
          {saveMessage}
        </p>
      )}
      <Puck<typeof editorConfig>
        config={editorConfig}
        data={savedPage.data}
        onChange={handleChange}
        onPublish={handlePublish}
        headerTitle="Sky Portal component editor"
      />
    </div>
  );
};

export const SavedPuckPagePreview = () => {
  const [savedPage] = useState(readSavedData);

  return savedPage.error ? (
    <p className="alert alert-warning m-3" role="alert">
      {savedPage.error}
    </p>
  ) : (
    <Render<typeof editorConfig> config={editorConfig} data={savedPage.data} />
  );
};
