import { Button } from "@/components/ui/button";
import { Home, Users } from "lucide-react";
import Link from "next/link";

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Users"
        asChild
      >
        <Link href="/users">
          <Users />
          <span className="hidden lg:inline">Users</span>
        </Link>
      </Button>
    </div>
  );
}
