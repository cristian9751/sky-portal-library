
import { Button } from "@/components/ui/button";
import { ArrowRight, Plane, Plus, Trash2 } from "lucide-react";

export const Variants = () => (
  <section className="space-y-5">
    <h2 className="text-2xl font-bold">Button variants</h2>
    <div className="flex flex-wrap items-center gap-3">
      <Button>Primary action</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link style</Button>
      <Button variant="destructive"><Trash2 /> Delete</Button>
    </div>
  </section>
);

export const SizesAndIcons = () => (
  <section className="space-y-5">
    <h2 className="text-2xl font-bold">Sizes and icons</h2>
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
      <Button><Plane /> Book a flight</Button>
      <Button variant="outline"><Plus /> Add route</Button>
      <Button size="icon" aria-label="Continue"><ArrowRight /></Button>
    </div>
  </section>
);
