import "../styles.css"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export const FormControls = () => {
  const [newsletter, setNewsletter] = useState(true);
  return (
    <section className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Form controls</h2>
        <p className="text-sm text-muted-foreground">Interactive examples using the library components.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="pilot-name">Pilot name</Label>
        <Input id="pilot-name" placeholder="e.g. Alex García" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pilot-email">Email address</Label>
        <Input id="pilot-email" type="email" placeholder="pilot@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" placeholder="Write a message..." />
      </div>
      <label className="flex items-center gap-3 text-sm">
        <Checkbox defaultChecked />
        I accept the terms and conditions
      </label>
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <p className="font-medium">Flight updates</p>
          <p className="text-sm text-muted-foreground">Receive news about the airline.</p>
        </div>
        <Switch checked={newsletter} onCheckedChange={setNewsletter} />
      </div>
      <Button type="button">Save preferences</Button>
    </section>
  );
};
