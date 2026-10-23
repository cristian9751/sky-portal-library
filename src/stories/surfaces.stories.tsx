import "../styles.css"
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Plane } from "lucide-react";

export const CardsAndBadges = () => (
  <section className="max-w-2xl space-y-6">
    <div className="flex flex-wrap gap-2">
      <Badge>Active pilot</Badge>
      <Badge variant="secondary">Training</Badge>
      <Badge variant="outline">Pending review</Badge>
      <Badge variant="destructive">Suspended</Badge>
    </div>
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-3 text-primary"><Plane /></div>
          <div>
            <CardTitle>Flight plan XSN204</CardTitle>
            <CardDescription>Madrid (LEMD) → Barcelona (LEBL)</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator />
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div><p className="text-muted-foreground">Aircraft</p><p className="font-semibold">Airbus A320</p></div>
          <div><p className="text-muted-foreground">Duration</p><p className="font-semibold">1h 15m</p></div>
          <div><p className="text-muted-foreground">Status</p><Badge variant="secondary">Scheduled</Badge></div>
        </div>
      </CardContent>
      <CardFooter><p className="text-sm text-muted-foreground">Last updated just now</p></CardFooter>
    </Card>
  </section>
);

export const FeedbackAndLoading = () => (
  <section className="max-w-xl space-y-6">
    <Alert>
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>Changes saved</AlertTitle>
      <AlertDescription>Your pilot profile has been updated successfully.</AlertDescription>
    </Alert>
    <Alert variant="destructive">
      <AlertTitle>Connection issue</AlertTitle>
      <AlertDescription>We could not refresh the flight data. Try again shortly.</AlertDescription>
    </Alert>
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src="https://air-spain.es/imagenes/va.png" alt="Air Spain" />
        <AvatarFallback>AS</AvatarFallback>
      </Avatar>
      <div><p className="font-medium">Air Spain Operations</p><p className="text-sm text-muted-foreground">Operations team</p></div>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-sm"><span>Training progress</span><span>72%</span></div>
      <Progress value={72} />
    </div>
    <div className="space-y-3">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  </section>
);
