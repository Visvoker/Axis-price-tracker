import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

type InviteStatusCardProps = {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function InviteStatusCard({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  secondaryLabel,
  secondaryHref,
}: InviteStatusCardProps) {
  return (
    <Card className="w-full max-w-md overflow-hidden py-0 pt-6">
      <CardHeader className="items-center text-center space-y-2">
        {icon && (
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            {icon}
          </div>
        )}

        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      {(actionLabel || secondaryLabel) && (
        <CardFooter className="flex justify-end gap-2 border-t bg-muted/40 p-4">
          {secondaryLabel && secondaryHref && (
            <Button variant="outline" asChild>
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          )}

          {actionLabel && actionHref && (
            <Button asChild>
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
